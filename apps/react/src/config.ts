// Reads auth credentials from Vite environment variables.
// Only service account auth is supported — set VITE_GEBETA_ACCESS_TOKEN + VITE_GEBETA_REFRESH_TOKEN.

const accessToken = import.meta.env.VITE_GEBETA_ACCESS_TOKEN as string | undefined;
const refreshToken = import.meta.env.VITE_GEBETA_REFRESH_TOKEN as string | undefined;

if (!accessToken || !refreshToken) {
  console.warn(
    '[Gebeta] Missing auth. Set VITE_GEBETA_ACCESS_TOKEN + VITE_GEBETA_REFRESH_TOKEN in apps/react/.env'
  );
}

export const auth = {
  accessToken: accessToken ?? '',
  refreshToken: refreshToken ?? '',
};
