import type { ErrorCode, ErrorDomain } from './codes';

/**
 * Base error details structure for all Gebeta errors.
 */
export interface GebetaErrorDetails {
  /** Error code for programmatic error handling */
  code: ErrorCode;
  /** Human-readable error message */
  message: string;
  /** Domain/feature area where the error occurred */
  domain?: ErrorDomain;
  /**
   * Additional context data for debugging and error handling.
   * Examples:
   * - Field names that failed validation
   * - Retry information (e.g., { retryAfter: 60 })
   * - Request parameters that caused the error
   * - Any other relevant debugging information
   */
  context?: Record<string, unknown>;
  /** Original error that was wrapped (if applicable) */
  originalError?: Error;
  /** Timestamp when the error occurred */
  timestamp: number;
  /**
   * Request ID from the API response (for API errors).
   * Used to correlate errors with server-side logs for debugging.
   * Typically returned in response headers (x-request-id) or error response body.
   */
  requestId?: string;
}

/**
 * API error response structure from backend.
 */
export interface ApiErrorResponse {
  error: {
    code?: string;
    message: string;
    details?: Record<string, unknown>;
    requestId?: string;
  };
}
