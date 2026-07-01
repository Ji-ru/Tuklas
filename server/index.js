import express from 'express';
import crypto from 'crypto';
import compression from 'compression';
import { env } from './config/env.js';
import { corsMiddleware, helmetMiddleware, generateLimiter, chatLimiter, destinationLimiter } from './middleware/security.js';
import { errorHandler } from './middleware/errorHandler.js';
import pool from './db/index.js';

import generateRoute from './routes/generate.js';
import chatRoute from './routes/chat.js';
import destinationsRoute from './routes/destinations.js';

const app = express();

// Security and Performance Middlewares
app.use(helmetMiddleware);
app.use(corsMiddleware);
app.use(compression());
app.use(express.json({ limit: '100kb' }));

// Request ID middleware for log correlation
app.use((req, _res, next) => {
  req.id = crypto.randomUUID();
  next();
});

// Health check endpoint
app.get('/', (_req, res) => {
  res.send('Tuklas API Backend is running!');
});

app.get('/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'healthy', uptime: process.uptime() });
  } catch {
    res.status(503).json({ status: 'unhealthy', error: 'Database connection failed' });
  }
});

// Routes with specific rate limiters
app.use('/api/generate', generateLimiter, generateRoute);
app.use('/api/chat', chatLimiter, chatRoute);
app.use('/api/destinations', destinationLimiter, destinationsRoute);

// Global Error Handler
app.use(errorHandler);

const server = app.listen(env.PORT, () => {
  console.log(`Server is running on port ${env.PORT}`);
});

// Graceful shutdown
const shutdown = async (signal) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  server.close(async () => {
    await pool.end();
    console.log('Database pool closed. Exiting.');
    process.exit(0);
  });

  // Force exit after 10 seconds if graceful shutdown stalls
  setTimeout(() => {
    console.error('Forced shutdown after timeout.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
