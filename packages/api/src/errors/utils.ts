import { GebetaError } from './base';
import type { ErrorCode, ErrorDomain } from './codes';
import type { ApiErrorResponse } from './types';

/**
 * Type guard to check if an error is a GebetaError.
 */
export function isGebetaError(error: unknown): error is GebetaError {
  return error instanceof GebetaError;
}

/**
 * Gets the error code from an error, or null if not a GebetaError.
 */
export function getErrorCode(error: unknown): ErrorCode | null {
  if (isGebetaError(error)) {
    return error.code;
  }
  return null;
}

/**
 * Gets the error domain from an error, or null if not a GebetaError.
 */
export function getErrorDomain(error: unknown): ErrorDomain | null {
  if (isGebetaError(error)) {
    return error.domain || null;
  }
  return null;
}

/**
 * Formats an error for logging purposes.
 */
export function formatErrorForLogging(error: GebetaError): string {
  const parts = [`[${error.code}]`, error.domain ? `[${error.domain}]` : '', error.message];

  if (error.requestId) {
    parts.push(`(Request ID: ${error.requestId})`);
  }

  if (error.context && Object.keys(error.context).length > 0) {
    parts.push(`Context: ${JSON.stringify(error.context)}`);
  }

  if (error.originalError) {
    parts.push(`Original: ${error.originalError.message}`);
  }

  return parts.filter(Boolean).join(' ');
}

/**
 * Parses an API error response from a Response object.
 */
export async function parseApiErrorResponse(response: Response): Promise<ApiErrorResponse> {
  try {
    const data = await response.json();
    if (data.error) {
      return data as ApiErrorResponse;
    }
    return {
      error: {
        message: data.msg || `HTTP ${response.status}: ${response.statusText}`,
      },
    };
  } catch {
    return {
      error: {
        message: `HTTP ${response.status}: ${response.statusText}`,
      },
    };
  }
}

/**
 * Extracts request ID from a Response object (from headers or body).
 */
export async function extractRequestId(response: Response): Promise<string | undefined> {
  const headerId = response.headers.get('x-request-id') || response.headers.get('request-id');
  if (headerId) {
    return headerId;
  }

  try {
    const data = await response.json();
    return data.error?.requestId || data.requestId;
  } catch {
    return undefined;
  }
}
