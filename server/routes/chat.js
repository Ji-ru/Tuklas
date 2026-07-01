import { Router } from 'express';
import { chatSchema, validateBody } from '../middleware/validate.js';
import { chatWithAI } from '../services/gemini.js';
import crypto from 'crypto';

const router = Router();

router.post('/', validateBody(chatSchema), async (req, res, next) => {
  try {
    const { messages, sessionId } = req.body;
    const currentSessionId = sessionId || crypto.randomUUID();

    console.log(`[CHAT] Request for session ${currentSessionId} (${messages.length} messages)`);

    const { reply, itinerary } = await chatWithAI(messages);

    console.log(`[CHAT] Response generated. Itinerary included: ${!!itinerary}`);

    res.json({
      reply,
      sessionId: currentSessionId,
      itinerary: itinerary || undefined,
    });

  } catch (error) {
    next(error);
  }
});

export default router;
