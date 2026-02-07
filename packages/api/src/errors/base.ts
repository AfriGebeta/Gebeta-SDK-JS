import type { ErrorCode, ErrorDomain } from './codes';
import type { GebetaErrorDetails } from './types';

/**
 * Base error class for all Gebeta SDK errors.
 * Provides consistent error structure across all SDKs.
 */
export class GebetaError extends Error {
  public readonly code: ErrorCode;
  public readonly domain?: ErrorDomain;
  public readonly context?: Record<string, unknown>;
  public readonly originalError?: Error;
  public readonly timestamp: number;
  public readonly requestId?: string;

  constructor(details: GebetaErrorDetails) {
    super(details.message);
    this.name = 'GebetaError';
    this.code = details.code;
    this.domain = details.domain;
    this.context = details.context;
    this.originalError = details.originalError;
    this.timestamp = details.timestamp;
    this.requestId = details.requestId;

    // Maintains proper stack trace for where error was thrown (V8-specific)
    const ErrorConstructor = Error as any;
    if (typeof ErrorConstructor.captureStackTrace === 'function') {
      ErrorConstructor.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Get error details as a plain object.
   */
  toJSON(): GebetaErrorDetails {
    return {
      code: this.code,
      message: this.message,
      domain: this.domain,
      context: this.context,
      originalError: this.originalError,
      timestamp: this.timestamp,
      requestId: this.requestId,
    };
  }
}
