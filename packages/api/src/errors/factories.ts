import { ErrorCode } from './codes';
import { ValidationError } from './validation';
import { NetworkError, NetworkTimeoutError, NetworkOfflineError } from './network';
import {
  ApiError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  RateLimitError,
  ServerError,
  getErrorCodeForStatusCode,
} from './api';
import { GeocodingError, RoutingError, NavigationError, TrackingError } from './business';
import type { ApiErrorResponse } from './types';

/**
 * Creates a validation error for a required field given a field name and a reason.
 */
export function createValidationError(field: string, reason?: string): ValidationError {
  const message = reason
    ? `Validation failed for field '${field}': ${reason}`
    : `Field '${field}' is required`;
  return new ValidationError(message, field);
}

/**
 * Creates a network error from a fetch failure given an original error and a context.
 */
export function createNetworkError(
  originalError: Error,
  context?: Record<string, unknown>
): NetworkError {
  return new NetworkError(
    `Network request failed: ${originalError.message}`,
    ErrorCode.NETWORK_FAILED,
    originalError,
    context
  );
}

/**
 * Creates a network timeout error given a timeout in milliseconds and an original error.
 */
export function createNetworkTimeoutError(
  originalError?: Error,
  timeoutMs?: number
): NetworkTimeoutError {
  return new NetworkTimeoutError(timeoutMs, originalError);
}

/**
 * Creates a network offline error.
 */
export function createNetworkOfflineError(originalError?: Error): NetworkOfflineError {
  return new NetworkOfflineError(originalError);
}

/**
 * Creates an API error from an HTTP response.
 * Uses getErrorCodeForStatusCode (from api.ts) as the single source of truth
 * for status code → error code mapping, then instantiates the appropriate error class.
 */
export function createApiError(
  statusCode: number,
  response: ApiErrorResponse | string,
  requestId?: string
): ApiError {
  const finalRequestId =
    typeof response === 'object' ? requestId || response.error.requestId : requestId;

  const message =
    typeof response === 'string' ? response : response.error.message || 'API request failed';

  const context = typeof response === 'object' ? response.error.details : undefined;

  // Use the centralized mapping function to determine error code
  // Then create the appropriate error class based on status code
  // This maintains single source of truth: getErrorCodeForStatusCode handles the mapping
  if (statusCode >= 500) {
    return new ServerError(message, statusCode, finalRequestId);
  }
  if (statusCode === 429) {
    const retryAfter =
      typeof response === 'object'
        ? (response.error.details?.retryAfter as number | undefined)
        : undefined;
    return new RateLimitError(message, finalRequestId, retryAfter);
  }
  if (statusCode === 404) {
    return new NotFoundError(message, finalRequestId);
  }
  if (statusCode === 403) {
    return new ForbiddenError(message, finalRequestId);
  }
  if (statusCode === 401) {
    return new UnauthorizedError(message, finalRequestId);
  }
  if (statusCode === 400) {
    return new BadRequestError(message, finalRequestId, context);
  }

  // Fallback: use generic ApiError with mapped error code
  return new ApiError(
    message,
    statusCode,
    getErrorCodeForStatusCode(statusCode),
    finalRequestId,
    context
  );
}

/**
 * Creates a geocoding error given a code, message and a context.
 */
export function createGeocodingError(
  code: ErrorCode,
  message: string,
  context?: Record<string, unknown>
): GeocodingError {
  return new GeocodingError(code, message, context);
}

/**
 * Creates a routing error given a code, message and a context.
 */
export function createRoutingError(
  code: ErrorCode,
  message: string,
  context?: Record<string, unknown>
): RoutingError {
  return new RoutingError(code, message, context);
}

/**
 * Creates a navigation error given a code, message and a context.
 */
export function createNavigationError(
  code: ErrorCode,
  message: string,
  context?: Record<string, unknown>
): NavigationError {
  return new NavigationError(code, message, context);
}

/**
 * Creates a tracking error given a code, message and a context.
 */
export function createTrackingError(
  code: ErrorCode,
  message: string,
  context?: Record<string, unknown>
): TrackingError {
  return new TrackingError(code, message, context);
}
