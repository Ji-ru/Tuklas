import crypto from 'crypto';
import { query } from '../db/index.js';

export function makeCacheKey(params) {
  // Sort destinations by hub name for consistent hashing regardless of selection order
  const sortedDests = (params.destinations || []).map(d => ({
    region: d.region?.toLowerCase().trim(),
    hub: d.hub?.toLowerCase().trim(),
  })).sort((a, b) => (a.hub || '').localeCompare(b.hub || ''));

  const normalized = JSON.stringify({
    destinations: sortedDests,
    duration: params.duration,
    purpose: (params.purpose || 'Leisure').toLowerCase().trim(),
    pace: (params.pace || 'Moderate').toLowerCase().trim(),
    budget: params.budget?.toLowerCase().trim() || null,
    budgetBasis: params.budgetBasis?.toLowerCase().trim() || null,
    travelGroup: params.travelGroup?.toLowerCase().trim() || null,
    accommodation: params.accommodation?.toLowerCase().trim() || null,
    dietary: params.dietary?.toLowerCase().trim() || null,
    notes: params.notes?.toLowerCase().trim() || null,
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
  // Insert new entry with TTL of 7 days. Use ON CONFLICT to prevent constraint violation on race conditions.
  const insertQuery = `
    INSERT INTO saved_itineraries (
      hub_name, duration_days, purpose, pace,
      budget, budget_basis, travel_group, accommodation, dietary, notes,
      itinerary_data, cache_key, expires_at
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW() + INTERVAL '7 days')
    ON CONFLICT (cache_key) DO UPDATE 
      SET itinerary_data = EXCLUDED.itinerary_data, 
          expires_at = EXCLUDED.expires_at,
          hub_name = EXCLUDED.hub_name,
          notes = EXCLUDED.notes
    RETURNING id
  `;
  // Join all hub names for the hub_name column (VARCHAR(1000)). Sort them to match cacheKey sorting
  const sortedHubNames = (params.destinations || [])
    .map(d => d.hub)
    .sort((a, b) => a.localeCompare(b))
    .join(', ');
    
  const values = [
    sortedHubNames,
    params.duration,
    params.purpose || 'Leisure',
    params.pace || 'Moderate',
    params.budget || null,
    params.budgetBasis || null,
    params.travelGroup || null,
    params.accommodation || null,
    params.dietary || null,
    params.notes || null,
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
