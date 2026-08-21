import { Response, NextFunction } from 'express';
import { ExtendedRequest } from './requestLogger';
import { verifyToken, JwtPayload } from '../utils/crypto';
import { UnauthorizedError } from '../utils/errors';
import { db } from '../config/database';

export async function authMiddleware(req: ExtendedRequest, _res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Authentication token missing or invalid format');
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token);

    if (!payload || !payload.userId) {
      throw new UnauthorizedError('Invalid or expired authentication token');
    }

    // Lookup user in DB to verify user is active and role is fresh
    const users = db.getCollection('users');
    const user = users.find((u) => u.id === payload.userId && !u.isDeleted);

    if (!user) {
      throw new UnauthorizedError('User account not found or deactivated');
    }

    // Attach sanitized user to request context
    const { passwordHash, ...sanitizedUser } = user;
    req.user = sanitizedUser;

    next();
  } catch (err) {
    next(err);
  }
}

export function optionalAuthMiddleware(req: ExtendedRequest, _res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const payload = verifyToken(token);
      if (payload && payload.userId) {
        const users = db.getCollection('users');
        const user = users.find((u) => u.id === payload.userId && !u.isDeleted);
        if (user) {
          const { passwordHash, ...sanitizedUser } = user;
          req.user = sanitizedUser;
        }
      }
    }
  } catch {
    // Ignore optional auth error
  }
  next();
}
