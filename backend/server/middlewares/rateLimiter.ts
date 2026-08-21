import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS } from '../constants/httpCodes';
import { ERROR_CODES } from '../constants/errorCodes';
import { sendError } from '../utils/response';

interface RateLimitStore {
  [ip: string]: {
    count: number;
    resetTime: number;
  };
}

export function createRateLimiter(maxRequests = 100, windowMs = 60 * 1000) {
  const store: RateLimitStore = {};

  // Clean up expired records every 5 minutes
  setInterval(() => {
    const now = Date.now();
    for (const ip in store) {
      if (store[ip].resetTime < now) {
        delete store[ip];
      }
    }
  }, 5 * 60 * 1000);

  return (req: Request, res: Response, next: NextFunction) => {
    const ip = (req.headers['x-forwarded-for'] as string) || req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();

    if (!store[ip] || store[ip].resetTime < now) {
      store[ip] = {
        count: 1,
        resetTime: now + windowMs,
      };
      return next();
    }

    store[ip].count += 1;

    if (store[ip].count > maxRequests) {
      const retryAfterSec = Math.ceil((store[ip].resetTime - now) / 1000);
      res.setHeader('Retry-After', retryAfterSec);
      return sendError(
        res,
        `Rate limit exceeded. Please retry after ${retryAfterSec} seconds.`,
        HTTP_STATUS.TOO_MANY_REQUESTS,
        ERROR_CODES.TOO_MANY_REQUESTS
      );
    }

    next();
  };
}
