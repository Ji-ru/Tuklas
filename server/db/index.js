import pg from 'pg';
import { env } from '../config/env.js';

const { Pool } = pg;

// Automatically configure SSL for known external database providers
const isExternalDb = env.DATABASE_URL &&
  (env.DATABASE_URL.includes('neon.tech') ||
   env.DATABASE_URL.includes('supabase.co') ||
   env.DATABASE_URL.includes('supabase.in'));

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: isExternalDb
    ? { rejectUnauthorized: env.NODE_ENV === 'production' }
    : false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client', err);
});

export const query = (text, params) => pool.query(text, params);
export default pool;
