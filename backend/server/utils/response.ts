import { Response } from 'express';
import { HTTP_STATUS, HttpStatusCode } from '../constants/httpCodes';
import { ERROR_CODES, ErrorCode } from '../constants/errorCodes';

export interface ApiResponseMeta {
  total?: number;
  page?: number;
  limit?: number;
  [key: string]: any;
}

export function sendSuccess<T>(
  res: Response,
  data: T,
  message?: string,
  statusCode: HttpStatusCode = HTTP_STATUS.OK,
  meta?: ApiResponseMeta
) {
  return res.status(statusCode).json({
    success: true,
    data,
    ...(message ? { message } : {}),
    ...(meta ? { meta } : {}),
  });
}

export function sendError(
  res: Response,
  message: string,
  statusCode: HttpStatusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR,
  code: ErrorCode = ERROR_CODES.INTERNAL_SERVER_ERROR,
  details: any = null
) {
  return res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      ...(details ? { details } : {}),
    },
  });
}
