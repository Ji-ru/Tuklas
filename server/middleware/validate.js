import { z } from 'zod';

export const validateBody = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('[VALIDATION ERROR]', JSON.stringify(error.errors));
      res.status(400).json({
        error: 'Invalid request data',
        code: 'VALIDATION_ERROR',
        details: error.errors,
      });
    } else {
      next(error);
    }
  }
};

export const generateSchema = z.object({
  region: z.string().max(100).optional(),
  hub: z.string().min(1).max(100),
  duration: z.number().int().min(1).max(30),
  purpose: z.string().max(500).optional(),
  pace: z.string().max(100).optional(),
  budget: z.string().max(100).optional(),
  budgetBasis: z.string().max(100).optional(),
  travelGroup: z.string().max(100).optional(),
  accommodation: z.string().max(100).optional(),
  dietary: z.string().max(200).optional(),
  notes: z.string().max(500).optional(),
});

export const chatSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string().min(1).max(100000),
  })).min(1).max(50),
  sessionId: z.string().uuid().optional(),
});
