import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';

// Parse allowed origins from environment variable
const allowedOrigins = env.ALLOWED_ORIGINS.split(',').map(o => o.trim()).filter(Boolean);

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    // In development, allow requests with no origin (e.g., Postman, curl)
    // In production, require a valid origin header
    if (!origin && env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    if (origin && allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200,
});

export const helmetMiddleware = helmet();

// Rate limiting for /api/generate
export const generateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  limit: 5, // 5 requests per minute
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.', code: 'RATE_LIMIT_EXCEEDED' },
});

// Rate limiting for /api/chat
export const chatLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  limit: 20, // 20 requests per minute
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.', code: 'RATE_LIMIT_EXCEEDED' },
});

// Rate limiting for /api/destinations
export const destinationLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  limit: 60, // 60 requests per minute
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.', code: 'RATE_LIMIT_EXCEEDED' },
});
