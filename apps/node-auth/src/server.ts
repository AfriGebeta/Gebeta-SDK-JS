/**
 * Backend auth endpoint — @gebeta/node demo.
 *
 * Your client app sends its client_token to this server.
 * This server exchanges it (using the secret server_token) for an
 * access/refresh token pair and returns those credentials to the client.
 *
 * The server_token never leaves this backend.
 *
 * Endpoints:
 *   POST /auth          { "clientToken": "<token>" } → { accessToken, refreshToken }
 *   GET  /health        → { status: "ok" }
 */

import { createServer, IncomingMessage, ServerResponse } from 'node:http';
import { GebetaAuth } from '@gebeta/node';
import 'dotenv/config';

// ---------------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------------

const { GEBETA_SERVER_TOKEN, PORT = '3001' } = process.env;

if (!GEBETA_SERVER_TOKEN) {
  throw new Error('GEBETA_SERVER_TOKEN is required. Set it in your .env file.');
}

const auth = new GebetaAuth({ serverToken: GEBETA_SERVER_TOKEN });

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function json(res: ServerResponse, status: number, body: unknown) {
  const payload = JSON.stringify(body, null, 2);
  res.writeHead(status, { 'Content-Type': 'application/json', ...CORS_HEADERS });
  res.end(payload);
}

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => (data += chunk));
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

// ---------------------------------------------------------------------------
// Request handler
// ---------------------------------------------------------------------------

async function handler(req: IncomingMessage, res: ServerResponse) {
  const path = new URL(req.url ?? '/', `http://localhost`).pathname;

  if (req.method === 'OPTIONS') {
    res.writeHead(204, CORS_HEADERS);
    return res.end();
  }

  if (path === '/health') {
    return json(res, 200, { status: 'ok' });
  }

  if (path === '/auth' && req.method === 'POST') {
    let body: { clientToken?: string };
    try {
      body = JSON.parse(await readBody(req));
    } catch {
      return json(res, 400, { error: 'Invalid JSON body' });
    }

    const { clientToken } = body;
    if (!clientToken) {
      return json(res, 400, { error: 'Missing field: clientToken' });
    }

    try {
      const credentials = await auth.authenticate(clientToken);
      return json(res, 200, credentials);
    } catch (err) {
      const status = err instanceof Error && err.name === 'UnauthorizedError' ? 401 : 502;
      return json(res, status, { error: err instanceof Error ? err.message : String(err) });
    }
  }

  return json(res, 404, {
    error: 'Not found',
    endpoints: ['POST /auth  body: { "clientToken": "<token>" }', 'GET  /health'],
  });
}

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------

const port = parseInt(PORT, 10);
createServer(handler).listen(port, () => {
  console.log(`Gebeta auth server running on http://localhost:${port}`);
  console.log('  POST /auth  body: { "clientToken": "<your-client-token>" }');
});
