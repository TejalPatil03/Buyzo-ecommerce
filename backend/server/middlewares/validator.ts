import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../utils/errors';

export type ValidatorFn = (data: any) => { valid: boolean; errors?: string[] };

export function validateBody(validator: ValidatorFn) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = validator(req.body);
    if (!result.valid) {
      return next(new ValidationError('Request body validation failed', result.errors));
    }
    next();
  };
}

export function validateQuery(validator: ValidatorFn) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = validator(req.query);
    if (!result.valid) {
      return next(new ValidationError('Request query parameters validation failed', result.errors));
    }
    next();
  };
}

export function validateParams(validator: ValidatorFn) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = validator(req.params);
    if (!result.valid) {
      return next(new ValidationError('Request URL parameters validation failed', result.errors));
    }
    next();
  };
}
