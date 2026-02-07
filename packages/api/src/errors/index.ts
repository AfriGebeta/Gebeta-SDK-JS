// Base error class
export { GebetaError } from './base';

// Error codes and domains
export { ErrorCode, ErrorDomain } from './codes';

// Error types
export type { GebetaErrorDetails, ApiErrorResponse } from './types';

// Validation errors
export { ValidationError } from './validation';

// Network errors
export { NetworkError, NetworkTimeoutError, NetworkOfflineError } from './network';

// API errors
export {
  ApiError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  RateLimitError,
  ServerError,
} from './api';

// Business logic errors
export {
  BusinessLogicError,
  GeocodingError,
  RoutingError,
  NavigationError,
  TrackingError,
} from './business';

// Platform errors
export {
  PlatformError,
  GeolocationDeniedError,
  GeolocationUnavailableError,
  GeolocationTimeoutError,
} from './platform';

// Factory functions
export * from './factories';

// Utility functions
export * from './utils';
