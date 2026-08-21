import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { HTTP_STATUS } from '../constants/httpCodes';
import { ERROR_CODES } from '../constants/errorCodes';
import { logger } from '../config/logger';
import { ENV } from '../config/env';

export function errorHandler(err: any, req: Request, res: Response, _next: NextFunction) {
  const isAppError = err instanceof AppError;
  const statusCode = isAppError ? err.statusCode : HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const code = isAppError ? err.code : ERROR_CODES.INTERNAL_SERVER_ERROR;
  const message = err.message || 'An unexpected internal server error occurred';
  const details = isAppError ? err.details : null;

  // Only log stack traces for unexpected server errors (5xx), not business errors (4xx)
  const isServerError = statusCode >= 500;
  const meta = {
    method: req.method,
    url: req.originalUrl || req.url,
    statusCode,
    errorCode: code,
    ...(isServerError && !ENV.IS_PRODUCTION ? { stack: err.stack } : {}),
  };

  if (isServerError) {
    logger.error(`Unhandled server error on ${req.method} ${req.originalUrl}: ${message}`, err, meta);
  } else {
    logger.warn(`Request error on ${req.method} ${req.originalUrl}: ${message}`, meta);
  }

  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message: ENV.IS_PRODUCTION && !isAppError ? 'Internal server error' : message,
      ...(details ? { details } : {}),
      ...(isServerError && !ENV.IS_PRODUCTION && !isAppError ? { stack: err.stack } : {}),
    },
  });
}
