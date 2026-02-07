import { ErrorCode, ErrorDomain } from './codes';
import { GebetaError } from './base';

/**
 * Error thrown for platform-specific failures (e.g., geolocation API).
 */
export class PlatformError extends GebetaError {
  constructor(
    code: ErrorCode,
    message: string,
    context?: Record<string, unknown>,
    originalError?: Error
  ) {
    super({
      code,
      message,
      domain: ErrorDomain.PLATFORM,
      context,
      originalError,
      timestamp: Date.now(),
    });
    this.name = 'PlatformError';
  }
}

/**
 * Error thrown when geolocation access is denied.
 */
export class GeolocationDeniedError extends PlatformError {
  constructor(originalError?: Error) {
    super(
      ErrorCode.PLATFORM_GEOLOCATION_DENIED,
      'Geolocation access denied by user',
      undefined,
      originalError
    );
    this.name = 'GeolocationDeniedError';
  }
}

/**
 * Error thrown when geolocation is unavailable.
 */
export class GeolocationUnavailableError extends PlatformError {
  constructor(originalError?: Error) {
    super(
      ErrorCode.PLATFORM_GEOLOCATION_UNAVAILABLE,
      'Geolocation is not available on this device',
      undefined,
      originalError
    );
    this.name = 'GeolocationUnavailableError';
  }
}

/**
 * Error thrown when geolocation request times out.
 */
export class GeolocationTimeoutError extends PlatformError {
  constructor(timeoutMs?: number, originalError?: Error) {
    super(
      ErrorCode.PLATFORM_GEOLOCATION_TIMEOUT,
      `Geolocation request timed out${timeoutMs ? ` after ${timeoutMs}ms` : ''}`,
      timeoutMs ? { timeoutMs } : undefined,
      originalError
    );
    this.name = 'GeolocationTimeoutError';
  }
}
