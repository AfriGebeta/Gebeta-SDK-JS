import { API, UnauthorizedError, NetworkError } from '@gebeta/api';

type AuthCredentials = API.Auth.Types.AuthCredentials;

/**
 * Server-side authentication helper for Gebeta Maps service accounts.
 *
 * Exchanges a client token and server token for a short-lived access/refresh
 * token pair. The server token is secret and must never be sent to the browser —
 * only the resulting `accessToken` is forwarded to the client.
 *
 * @example
 * ```ts
 * import { GebetaAuth } from '@gebeta/node';
 *
 * const auth = new GebetaAuth({ serverToken: process.env.GEBETA_SERVER_TOKEN! });
 *
 * // Express endpoint
 * app.post('/auth', async (req, res) => {
 *   const credentials = await auth.authenticate(req.body.clientToken);
 *   res.json(credentials); // { accessToken, refreshToken }
 * });
 * ```
 */
export class GebetaAuth {
  private readonly serverToken: string;

  /**
   * @param options.serverToken - Secret server token from the Gebeta dashboard.
   *   Keep this on your backend; never expose it to clients.
   */
  constructor(options: { serverToken: string }) {
    this.serverToken = options.serverToken;
  }

  /**
   * Exchange a client token for an access/refresh token pair.
   * Call this from your backend when a client presents its client_token.
   *
   * @param clientToken - The public client token received from the client app
   * @returns AuthCredentials to send back to the client
   * @throws {UnauthorizedError} If the Gebeta API rejects the token exchange
   * @throws {NetworkError} If the request fails at the network level
   */
  async authenticate(clientToken: string): Promise<AuthCredentials> {
    let response: Response;
    try {
      response = await fetch(API.Auth.Constants.AUTH_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_token: clientToken,
          server_token: this.serverToken,
        }),
      });
    } catch (error) {
      throw new NetworkError(
        error instanceof Error
          ? `Authentication request failed: ${error.message}`
          : 'Authentication request failed',
        API.Errors.Codes.NETWORK_REQUEST_FAILED,
        error instanceof Error ? error : undefined
      );
    }

    if (!response.ok) {
      throw new UnauthorizedError(`Authentication failed with status ${response.status}`);
    }

    const data = (await response.json()) as { data?: AuthCredentials };
    const credentials = data?.data;

    if (!credentials?.accessToken || !credentials?.refreshToken) {
      throw new UnauthorizedError('Authentication returned invalid credentials');
    }

    return credentials;
  }
}
