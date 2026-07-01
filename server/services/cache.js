import crypto from 'crypto';
import { query } from '../db/index.js';

export function makeCacheKey(params) {
  const normalized = JSON.stringify({
    region: params.region?.toLowerCase().trim(),
    hub: params.hub?.toLowerCase().trim(),
    duration: params.duration,
    purpose: params.purpose?.toLowerCase().trim(),
    pace: params.pace?.toLowerCase().trim(),
    budget: params.budget?.toLowerCase().trim(),
    budgetBasis: params.budgetBasis?.toLowerCase().trim(),
    travelGroup: params.travelGroup?.toLowerCase().trim(),
    accommodation: params.accommodation?.toLowerCase().trim(),
    dietary: params.dietary?.toLowerCase().trim(),
    // 'notes' is explicitly excluded due to its freeform nature
  });
  return crypto.createHash('sha256').update(normalized).digest('hex');
}

export async function getCachedItinerary(cacheKey) {
  const cacheQuery = `
    SELECT itinerary_data, id
    FROM saved_itineraries 
    WHERE cache_key = $1 AND expires_at > NOW()
    ORDER BY created_at DESC 
    LIMIT 1
  `;
  const result = await query(cacheQuery, [cacheKey]);
  return result.rows.length > 0 ? {
    itinerary: result.rows[0].itinerary_data,
    cacheId: result.rows[0].id
  } : null;
}

export async function saveItinerary(params, cacheKey, itineraryData) {
  // Insert new entry with TTL of 7 days (cleanup handled by background job)
  const insertQuery = `
    INSERT INTO saved_itineraries (
      hub_name, duration_days, purpose, pace,
      budget, travel_group, accommodation, dietary, notes,
      itinerary_data, cache_key, expires_at
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW() + INTERVAL '7 days')
    RETURNING id
  `;
  const values = [
    params.hub,
    params.duration,
    params.purpose || 'Leisure',
    params.pace || 'Moderate',
    params.budget,
    params.travelGroup,
    params.accommodation,
    params.dietary,
    params.notes,
    itineraryData,
    cacheKey
  ];
  const result = await query(insertQuery, values);
  return result.rows[0].id;
}

// Background cleanup of expired cache entries (runs every hour)
// This is non-blocking and doesn't affect request latency
function startCacheCleanup() {
  const CLEANUP_INTERVAL_MS = 60 * 60 * 1000; // 1 hour

  setInterval(async () => {
    try {
      const result = await query('DELETE FROM saved_itineraries WHERE expires_at < NOW()');
      if (result.rowCount > 0) {
        console.log(`[CACHE] Cleaned up ${result.rowCount} expired entries.`);
      }
    } catch (err) {
      console.error('[CACHE] Cleanup error:', err.message);
    }
  }, CLEANUP_INTERVAL_MS);
}

startCacheCleanup();
