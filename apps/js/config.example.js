// Create a file called config.js next to this one with your credentials.
//
// Option 1 — Service account auth (recommended):
//   Set GEBETA_ACCESS_TOKEN and GEBETA_REFRESH_TOKEN obtained from your backend
//   after calling GebetaAuth.authenticate(). Leave GEBETA_API_KEY empty.
//
// Option 2 — Legacy API key (deprecated):
//   Set GEBETA_API_KEY from https://gebeta.app. Leave the token fields empty.
function loadConfig() {
  return {
    GEBETA_ACCESS_TOKEN: '',
    GEBETA_REFRESH_TOKEN: '',
    GEBETA_API_KEY: '',
  };
}
