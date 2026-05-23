// Reads auth credentials from Vite environment variables.
// Set VITE_GEBETA_ACCESS_TOKEN + VITE_GEBETA_REFRESH_TOKEN for service account auth (preferred),
// or VITE_GEBETA_API_KEY for legacy API key auth.

// GebetaMapsConstructorOptions accepts either { auth: { accessToken, refreshToken } } or { apiKey }.
export interface AuthOptions {
  auth?: { accessToken: string; refreshToken: string };
  apiKey?: string;
}

function buildAuthParam(): AuthOptions {
  const accessToken = import.meta.env.VITE_GEBETA_ACCESS_TOKEN as string | undefined;
  const refreshToken = import.meta.env.VITE_GEBETA_REFRESH_TOKEN as string | undefined;
  const apiKey = import.meta.env.VITE_GEBETA_API_KEY as string | undefined;

  if (accessToken && refreshToken) {
    return { auth: { accessToken, refreshToken } };
  }
  if (apiKey) {
    return { apiKey };
  }
  // Fallback: will cause GebetaMaps constructor to throw — surface it clearly at runtime.
  console.warn(
    '[Gebeta] No auth configured. Set VITE_GEBETA_ACCESS_TOKEN + VITE_GEBETA_REFRESH_TOKEN ' +
    'or VITE_GEBETA_API_KEY in your .env file.'
  );
  return { apiKey: 'MISSING_API_KEY' };
}

export const authParam: AuthOptions = buildAuthParam();
