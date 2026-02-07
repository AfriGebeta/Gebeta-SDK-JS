import { ErrorCode, ErrorDomain } from './codes';
import { GebetaError } from './base';
import type { ApiErrorResponse } from './types';

/**
 * Base error class for API-related errors.
 */
export class ApiError extends GebetaError {
  public readonly statusCode: number;

  constructor(
    message: string,
    statusCode: number,
    code: ErrorCode,
    requestId?: string,
    context?: Record<string, unknown>
  ) {
    super({
      code,
      message,
      domain: ErrorDomain.API,
      context,
      timestamp: Date.now(),
      requestId,
    });
    this.name = 'ApiError';
    this.statusCode = statusCode;
  }

  static fromResponse(response: ApiErrorResponse, statusCode: number): ApiError {
    return new ApiError(
      response.error.message || 'API request failed',
      statusCode,
      getErrorCodeForStatusCode(statusCode),
      response.error.requestId,
      response.error.details
    );
  }
}

/**
 * Error thrown for 400 Bad Request responses.
 */
export class BadRequestError extends ApiError {
  constructor(message: string, requestId?: string, context?: Record<string, unknown>) {
    super(message, 400, ErrorCode.API_BAD_REQUEST, requestId, context);
    this.name = 'BadRequestError';
  }
}

/**
 * Error thrown for 401 Unauthorized responses.
 */
export class UnauthorizedError extends ApiError {
  constructor(message: string, requestId?: string) {
    super(message, 401, ErrorCode.API_UNAUTHORIZED, requestId);
    this.name = 'UnauthorizedError';
  }
}

/**
 * Error thrown for 403 Forbidden responses.
 */
export class ForbiddenError extends ApiError {
  constructor(message: string, requestId?: string) {
    super(message, 403, ErrorCode.API_FORBIDDEN, requestId);
    this.name = 'ForbiddenError';
  }
}

/**
 * Error thrown for 404 Not Found responses.
 */
export class NotFoundError extends ApiError {
  constructor(message: string, requestId?: string) {
    super(message, 404, ErrorCode.API_NOT_FOUND, requestId);
    this.name = 'NotFoundError';
  }
}

/**
 * Error thrown for 429 Rate Limit responses.
 */
export class RateLimitError extends ApiError {
  constructor(message: string, requestId?: string, retryAfter?: number) {
    super(
      message,
      429,
      ErrorCode.API_RATE_LIMIT,
      requestId,
      retryAfter ? { retryAfter } : undefined
    );
    this.name = 'RateLimitError';
  }
}

/**
 * Error thrown for 5xx Server Error responses.
 */
export class ServerError extends ApiError {
  constructor(message: string, statusCode: number, requestId?: string) {
    super(message, statusCode, ErrorCode.API_SERVER_ERROR, requestId);
    this.name = 'ServerError';
  }
}

/**
 * Maps HTTP status codes to appropriate error codes.
 * This is the SINGLE SOURCE OF TRUTH for status code → error code mapping.
 * All other code should use this function instead of duplicating the mapping logic.
 */
export function getErrorCodeForStatusCode(statusCode: number): ErrorCode {
  if (statusCode >= 500) {
    return ErrorCode.API_SERVER_ERROR;
  }
  if (statusCode === 429) {
    return ErrorCode.API_RATE_LIMIT;
  }
  if (statusCode === 404) {
    return ErrorCode.API_NOT_FOUND;
  }
  if (statusCode === 403) {
    return ErrorCode.API_FORBIDDEN;
  }
  if (statusCode === 401) {
    return ErrorCode.API_UNAUTHORIZED;
  }
  if (statusCode === 400) {
    return ErrorCode.API_BAD_REQUEST;
  }
  return ErrorCode.API_UNKNOWN_ERROR;
}
