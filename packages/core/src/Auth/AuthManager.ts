import { API, UnauthorizedError, NetworkError } from '@gebeta/api';
import { EventEmitter } from '../utils/EventEmitter';

type AuthCredentials = API.Auth.Types.AuthCredentials;

interface AuthEventMap {
  [API.Auth.Enums.Events.tokenRefreshed]: (credentials: AuthCredentials) => void;
  [API.Auth.Enums.Events.tokenRefreshFailed]: (error: Error) => void;
}


/**
 * Manages service account authentication credentials.
 * Wraps fetch to inject the Authorization header and handles 401 → refresh → single retry.
 * Optionally runs a background timer that proactively refreshes the token every 7–10 minutes.
 */
export class AuthManager extends EventEmitter<AuthEventMap> {
  private credentials: AuthCredentials;
  private refreshTimer: ReturnType<typeof setTimeout> | null = null;
  private autoRefreshActive = false;

  constructor(credentials: AuthCredentials) {
    super();
    this.credentials = credentials;
  }

  /**
   * Starts the proactive token-refresh timer.
   * Each refresh is scheduled with a random delay between 7 and 10 minutes
   * to avoid thundering-herd problems when many clients start simultaneously.
   * Safe to call multiple times — a running timer is stopped first.
   */
  startAutoRefresh(): void {
    this.stopAutoRefresh();
    this.autoRefreshActive = true;
    this.scheduleNextRefresh();
  }

  /**
   * Stops the proactive token-refresh timer. No-op if the timer is not running.
   */
  stopAutoRefresh(): void {
    this.autoRefreshActive = false;
    if (this.refreshTimer !== null) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  private scheduleNextRefresh(): void {
    this.refreshTimer = setTimeout(() => {
      this.refreshTimer = null;
      this.refreshAccessToken()
        .catch(() => {
          // tokenRefreshFailed is already emitted inside refreshAccessToken
        })
        .finally(() => {
          // reschedule regardless of success or failure so auth recovers on transient errors
          if (this.autoRefreshActive) {
            this.scheduleNextRefresh();
          }
        });
    }, API.Auth.Constants.TOKEN_REFRESH_INTERVAL_MS);
  }

  /**
   * Returns the current access token synchronously.
   * Always valid — updated only after a successful refresh.
   */
  getAccessToken(): string {
    return this.credentials.accessToken;
  }

  /**
   * Wraps fetch: injects Authorization header, handles 401 → refresh → single retry.
   * On second 401 (after refresh): throws UnauthorizedError.
   */
  async fetch(url: string, init?: RequestInit): Promise<Response> {
    const response = await this.doFetch(url, init);

    if (response.status !== 401) {
      return response;
    }

    // First 401 — attempt refresh
    await this.refreshAccessToken();

    // Single retry with new token
    const retryResponse = await this.doFetch(url, init);

    if (retryResponse.status === 401) {
      throw new UnauthorizedError('Authentication failed after token refresh');
    }

    return retryResponse;
  }

  /**
   * Allows the host app to push fresh credentials (e.g. after re-authenticating via backend).
   */
  updateCredentials(credentials: AuthCredentials): void {
    this.credentials = credentials;
  }

  private doFetch(url: string, init?: RequestInit): Promise<Response> {
    return globalThis.fetch(url, {
      ...init,
      headers: {
        ...init?.headers,
        Authorization: `Bearer ${this.credentials.accessToken}`,
      },
    });
  }

  private async refreshAccessToken(): Promise<void> {
    let response: Response;
    try {
      response = await globalThis.fetch(API.Auth.Constants.REFRESH_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: this.credentials.refreshToken }),
      });
    } catch (error) {
      const err = new NetworkError(
        error instanceof Error ? `Token refresh failed: ${error.message}` : 'Token refresh failed',
        API.Errors.Codes.NETWORK_REQUEST_FAILED,
        error instanceof Error ? error : undefined
      );
      this.emit(API.Auth.Enums.Events.tokenRefreshFailed, err);
      throw new UnauthorizedError('Token refresh request failed');
    }

    if (!response.ok) {
      const err = new UnauthorizedError(
        `Token refresh failed with status ${response.status}`
      );
      this.emit(API.Auth.Enums.Events.tokenRefreshFailed, err);
      throw err;
    }

    const data = await response.json();
    const newCredentials: AuthCredentials = data?.data;

    if (!newCredentials?.accessToken || !newCredentials?.refreshToken) {
      const err = new UnauthorizedError('Token refresh returned invalid credentials');
      this.emit(API.Auth.Enums.Events.tokenRefreshFailed, err);
      throw err;
    }

    this.credentials = newCredentials;
    this.emit(API.Auth.Enums.Events.tokenRefreshed, newCredentials);
  }
}
