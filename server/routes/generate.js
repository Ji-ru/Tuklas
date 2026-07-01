import { Router } from 'express';
import { generateSchema, validateBody } from '../middleware/validate.js';
import { makeCacheKey, getCachedItinerary, saveItinerary } from '../services/cache.js';
import { generateItineraryFromAI } from '../services/gemini.js';

const router = Router();

router.post('/', validateBody(generateSchema), async (req, res, next) => {
  try {
    const params = req.body;
    console.log(`[GENERATE] Request for Hub: ${params.hub}, Days: ${params.duration}`);

    // 1. Generate cache key
    const cacheKey = makeCacheKey(params);
    
    // 2. Check cache
    const cachedResult = await getCachedItinerary(cacheKey);
    if (cachedResult) {
      console.log(`[GENERATE] Cache hit (${cachedResult.cacheId})`);
      return res.json({
        ...cachedResult.itinerary, // Spread to maintain expected top-level schema for frontend
        _meta: { cached: true, cacheId: cachedResult.cacheId } // Add metadata for debugging
      });
    }

    console.log('[GENERATE] Cache miss. Generating via Gemini...');
    
    // 3. Generate via Gemini
    const newItinerary = await generateItineraryFromAI(params);

    // 4. Save to DB
    const cacheId = await saveItinerary(params, cacheKey, newItinerary);
    console.log(`[GENERATE] Saved to cache (${cacheId})`);

    // 5. Return
    res.json({
      ...newItinerary,
      _meta: { cached: false, cacheId }
    });

  } catch (error) {
    next(error);
  }
});

export default router;
