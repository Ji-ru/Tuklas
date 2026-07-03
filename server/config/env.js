import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('3000'),
  NODE_ENV: z.string().default('development'),
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid URL'),
  GEMINI_API_KEY: z.string().min(1, 'GEMINI_API_KEY is required'),
  PLACES_API_NEW: z.string().optional().default(''),
  ALLOWED_ORIGINS: z.string().default('http://localhost:5173,http://localhost:4173'),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid environment variables:', _env.error.format());
  process.exit(1);
}

export const env = _env.data;
