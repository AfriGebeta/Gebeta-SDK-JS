// Fetches auth credentials from the node-auth backend.
// Set VITE_GEBETA_CLIENT_TOKEN in apps/react/.env.
// Start the node-auth server first (default: http://localhost:3001).

const clientToken = import.meta.env.VITE_GEBETA_CLIENT_TOKEN as string | undefined;
const authUrl = (import.meta.env.VITE_AUTH_URL as string | undefined) ?? 'http://localhost:3001/auth';

if (!clientToken) {
  console.warn('[Gebeta] Missing VITE_GEBETA_CLIENT_TOKEN in apps/react/.env');
}

export type Auth = { accessToken: string; refreshToken: string };

export async function fetchAuth(): Promise<Auth> {
  const res = await fetch(authUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clientToken }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`Auth failed (${res.status}): ${err.error ?? res.statusText}`);
  }

  return res.json();
}
