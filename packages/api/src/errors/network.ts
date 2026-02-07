import { ErrorCode, ErrorDomain } from './codes';
import { GebetaError } from './base';

/**
 * Error thrown when network operations fail.
 */
export class NetworkError extends GebetaError {
  constructor(
    message: string,
    code: ErrorCode,
    originalError?: Error,
    context?: Record<string, unknown>
  ) {
    super({
      code,
      message,
      domain: ErrorDomain.NETWORK,
      context,
      originalError,
      timestamp: Date.now(),
    });
    this.name = 'NetworkError';
  }
}

/**
 * Error thrown when a network request times out.
 */
export class NetworkTimeoutError extends NetworkError {
  constructor(timeoutMs?: number, originalError?: Error) {
    super(
      `Network request timed out${timeoutMs ? ` after ${timeoutMs}ms` : ''}`,
      ErrorCode.NETWORK_TIMEOUT,
      originalError,
      timeoutMs ? { timeoutMs } : undefined
    );
    this.name = 'NetworkTimeoutError';
  }
}

/**
 * Error thrown when the device is offline.
 */
export class NetworkOfflineError extends NetworkError {
  constructor(originalError?: Error) {
    super('Network request failed: device is offline', ErrorCode.NETWORK_OFFLINE, originalError);
    this.name = 'NetworkOfflineError';
  }
}
