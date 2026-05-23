// Quick script to test GebetaAuth service account flow.
// Usage: node test-auth.mjs <serverToken> <clientToken>

const AUTH_URL = 'https://mapapi.gebeta.app/api/v1/external/auth';

const [serverToken, clientToken] = process.argv.slice(2);

if (!serverToken || !clientToken) {
  console.error('Usage: node test-auth.mjs <serverToken> <clientToken>');
  process.exit(1);
}

const response = await fetch(AUTH_URL, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ client_token: clientToken, server_token: serverToken }),
});

const json = await response.json();
console.log('Status:', response.status);
console.log('Response:', JSON.stringify(json, null, 2));

if (!response.ok) {
  console.error('Auth failed');
  process.exit(1);
}

const { accessToken, refreshToken } = json?.data ?? {};
if (!accessToken || !refreshToken) {
  console.error('Missing accessToken or refreshToken in response');
  process.exit(1);
}

console.log('\nPaste into apps/js/config.js:');
console.log(`  GEBETA_ACCESS_TOKEN: '${accessToken}',`);
console.log(`  GEBETA_REFRESH_TOKEN: '${refreshToken}',`);
console.log('\nPaste into apps/react/.env:');
console.log(`VITE_GEBETA_ACCESS_TOKEN=${accessToken}`);
console.log(`VITE_GEBETA_REFRESH_TOKEN=${refreshToken}`);
