import { ErrorCode, ErrorDomain } from './codes';
import { GebetaError } from './base';

/**
 * Base error class for business logic errors.
 */
export class BusinessLogicError extends GebetaError {
  constructor(
    code: ErrorCode,
    message: string,
    domain: ErrorDomain,
    context?: Record<string, unknown>
  ) {
    super({
      code,
      message,
      domain,
      context,
      timestamp: Date.now(),
    });
    this.name = 'BusinessLogicError';
  }
}

/**
 * Error thrown for geocoding-related failures.
 */
export class GeocodingError extends BusinessLogicError {
  constructor(code: ErrorCode, message: string, context?: Record<string, unknown>) {
    super(code, message, ErrorDomain.GEOCODING, context);
    this.name = 'GeocodingError';
  }
}

/**
 * Error thrown for routing-related failures.
 */
export class RoutingError extends BusinessLogicError {
  constructor(code: ErrorCode, message: string, context?: Record<string, unknown>) {
    super(code, message, ErrorDomain.ROUTING, context);
    this.name = 'RoutingError';
  }
}

/**
 * Error thrown for navigation-related failures.
 */
export class NavigationError extends BusinessLogicError {
  constructor(code: ErrorCode, message: string, context?: Record<string, unknown>) {
    super(code, message, ErrorDomain.NAVIGATION, context);
    this.name = 'NavigationError';
  }
}

/**
 * Error thrown for tracking-related failures.
 */
export class TrackingError extends BusinessLogicError {
  constructor(code: ErrorCode, message: string, context?: Record<string, unknown>) {
    super(code, message, ErrorDomain.TRACKING, context);
    this.name = 'TrackingError';
  }
}
