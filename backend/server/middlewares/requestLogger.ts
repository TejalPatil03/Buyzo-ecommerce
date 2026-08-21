import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { logger } from '../config/logger';

export interface ExtendedRequest extends Request {
  id?: string;
  startTime?: number;
  user?: any;
}

export function requestLogger(req: ExtendedRequest, res: Response, next: NextFunction) {
  req.id = (req.headers['x-request-id'] as string) || crypto.randomUUID();
  req.startTime = Date.now();

  res.setHeader('X-Request-Id', req.id);

  res.on('finish', () => {
    const durationMs = req.startTime ? Date.now() - req.startTime : 0;
    const meta = {
      requestId: req.id,
      method: req.method,
      url: req.originalUrl || req.url,
      statusCode: res.statusCode,
      durationMs,
      ip: req.ip || req.socket.remoteAddress,
    };

    if (res.statusCode >= 500) {
      logger.error(`HTTP ${req.method} ${req.originalUrl} failed with status ${res.statusCode}`, undefined, meta);
    } else if (res.statusCode >= 400) {
      logger.warn(`HTTP ${req.method} ${req.originalUrl} responded with ${res.statusCode}`, meta);
    } else {
      logger.info(`HTTP ${req.method} ${req.originalUrl} ${res.statusCode} (${durationMs}ms)`, meta);
    }
  });

  next();
}
