import express, { Request, Response, NextFunction } from 'express';
import { db } from './config/database';
import { ENV } from './config/env';
import { requestLogger } from './middlewares/requestLogger';
import { createRateLimiter } from './middlewares/rateLimiter';
import { errorHandler } from './middlewares/errorHandler';
import apiV1Router from './routes/v1/index';
import { healthController } from './controllers/HealthController';
import { assistantController } from './controllers/AssistantController';

/** Allowed origins for CORS — same origin in prod, all in dev */
const ALLOWED_ORIGINS = ENV.IS_PRODUCTION
  ? [ENV.APP_URL]
  : ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:3000'];

function corsMiddleware(req: Request, res: Response, next: NextFunction) {
  const origin = req.headers.origin as string | undefined;

  if (!ENV.IS_PRODUCTION || (origin && ALLOWED_ORIGINS.includes(origin))) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Request-Id');
  res.setHeader('Access-Control-Expose-Headers', 'X-Request-Id');
  res.setHeader('Access-Control-Max-Age', '86400'); // 24h preflight cache

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  next();
}

function securityHeaders(_req: Request, res: Response, next: NextFunction) {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  // Stop MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  // XSS protection for legacy browsers
  res.setHeader('X-XSS-Protection', '1; mode=block');
  // Only send referrer on same origin
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  // Remove default Express fingerprint
  res.removeHeader('X-Powered-By');
  next();
}

export async function createApp(): Promise<express.Application> {
  const app = express();

  // Initialize persistent database store
  await db.init();

  // Security & CORS (must be before parsers so preflight OPTIONS works)
  app.use(corsMiddleware);
  app.use(securityHeaders);

  // Core Request Parsers
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Global Middlewares
  app.use(requestLogger);
  app.use(createRateLimiter(200, 60 * 1000)); // 200 req / min general limit

  // API v1 Namespace
  app.use('/api/v1', apiV1Router);

  // Backward-compatible endpoints for existing AI Studio prototype frontend
  app.get('/api/health', (req, res) => healthController.getHealth(req, res));
  app.post('/api/assistant/chat', (req, res, next) => assistantController.chat(req, res, next));

  // Global Error Handler
  app.use(errorHandler);

  return app;
}
