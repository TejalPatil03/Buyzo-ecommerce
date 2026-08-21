import { Response, NextFunction } from 'express';
import { ExtendedRequest } from './requestLogger';
import { UserRole } from '../constants/roles';
import { ForbiddenError, UnauthorizedError } from '../utils/errors';

export function roleGuard(...allowedRoles: UserRole[]) {
  return (req: ExtendedRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError('Authentication required'));
    }

    if (!allowedRoles.includes(req.user.role as UserRole)) {
      return next(
        new ForbiddenError(
          `Access forbidden: requires one of [${allowedRoles.join(', ')}] roles, but user has '${req.user.role}'`
        )
      );
    }

    next();
  };
}
