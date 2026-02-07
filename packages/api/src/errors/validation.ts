import { ErrorCode, ErrorDomain } from './codes';
import { GebetaError } from './base';

/**
 * Error thrown when input validation fails.
 */
export class ValidationError extends GebetaError {
  constructor(message: string, field?: string, context?: Record<string, unknown>) {
    super({
      code: ErrorCode.VALIDATION_REQUIRED_FIELD,
      message,
      domain: ErrorDomain.VALIDATION,
      context: field ? { field, ...context } : context,
      timestamp: Date.now(),
    });
    this.name = 'ValidationError';
  }
}
