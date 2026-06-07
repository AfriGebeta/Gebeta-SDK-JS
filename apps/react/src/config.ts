// Auth config for the React example app.
//
// Two modes:
//   1. Service account: set VITE_GEBETA_CLIENT_TOKEN and run the node-auth server.
//   2. API key (legacy): set VITE_GEBETA_API_KEY — no server needed.

const clientToken = import.meta.env.VITE_GEBETA_CLIENT_TOKEN as string | undefined;
const apiKey = import.meta.env.VITE_GEBETA_API_KEY as string | undefined;
const authUrl =
  (import.meta.env.VITE_AUTH_URL as string | undefined) ?? 'http://localhost:3001/auth';

export type Auth =
  | { type: 'service_account'; accessToken: string; refreshToken: string }
  | { type: 'api_key'; apiKey: string };

export async function fetchAuth(): Promise<Auth> {
  if (clientToken) {
    const res = await fetch(authUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientToken }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(`Auth failed (${res.status}): ${err.error ?? res.statusText}`);
    }

    const { accessToken, refreshToken } = await res.json();
    return { type: 'service_account', accessToken, refreshToken };
  }

  if (apiKey) {
    return { type: 'api_key', apiKey };
  }

  throw new Error(
    'No auth configured. Set VITE_GEBETA_CLIENT_TOKEN or VITE_GEBETA_API_KEY in apps/react/.env'
  );
}
