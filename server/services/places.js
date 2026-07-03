import { env } from '../config/env.js';

const PLACES_TIMEOUT_MS = 5000; // 5-second hard timeout for Places API

/**
 * Searches for places using Google Places API (New) Text Search.
 * Used as the "Retrieval" step in the RAG pipeline.
 * Includes: AbortController timeout, field masking, graceful fallback.
 *
 * @param {string} query - e.g., "Top restaurants in Cebu" or "Best tourist attractions in Siargao"
 * @returns {Promise<string>} - A formatted string of places for the LLM prompt, or '' on failure
 */
export async function searchPlacesText(query) {
  if (!env.PLACES_API_NEW || env.PLACES_API_NEW === '') {
    console.warn('[PLACES] API key missing. Skipping RAG retrieval.');
    return '';
  }

  // AbortController provides a hard timeout so we never hang indefinitely
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), PLACES_TIMEOUT_MS);

  try {
    const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': env.PLACES_API_NEW,
        // Field Masking — only request the data we actually need to save API costs
        'X-Goog-FieldMask': 'places.displayName,places.rating,places.userRatingCount,places.formattedAddress,places.editorialSummary,places.priceLevel,places.primaryType'
      },
      body: JSON.stringify({
        textQuery: query,
        languageCode: 'en'
      })
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      // Production-safe logging: don't leak full error body in production
      if (env.NODE_ENV !== 'production') {
        const errorText = await response.text();
        console.error(`[PLACES] API Error: ${response.status} - ${errorText}`);
      } else {
        console.error(`[PLACES] API Error: HTTP ${response.status}`);
      }
      return '';
    }

    const data = await response.json();
    
    if (!data.places || data.places.length === 0) {
      console.log(`[PLACES] No results found for query: "${query}"`);
      return '';
    }

    // Format the results into a dense string to save LLM tokens
    const formattedPlaces = data.places.map(place => {
      const name = place.displayName?.text || 'Unknown Place';
      const rating = place.rating ? `${place.rating}/5.0 (${place.userRatingCount} reviews)` : 'No rating';
      const address = place.formattedAddress || 'No address';
      const summary = place.editorialSummary?.text ? ` | Summary: ${place.editorialSummary.text}` : '';
      const type = place.primaryType ? ` | Type: ${place.primaryType}` : '';
      
      return `• ${name} | Rating: ${rating} | Address: ${address}${type}${summary}`;
    }).slice(0, 15).join('\n'); // Keep max 15 places to control token usage

    console.log(`[PLACES] Retrieved ${Math.min(data.places.length, 15)} places for "${query}"`);
    return formattedPlaces;

  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      console.warn(`[PLACES] Request timed out after ${PLACES_TIMEOUT_MS / 1000}s. Skipping RAG.`);
    } else {
      console.error(`[PLACES] Fetch failed: ${error.message}`);
    }
    return '';
  }
}
