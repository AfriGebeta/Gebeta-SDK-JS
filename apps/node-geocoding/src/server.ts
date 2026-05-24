/**
 * Node.js geocoding search API — tree-shaking demo.
 *
 * Only imports GeocodingManager from '@gebeta/js/geocoding'.
 * No map rendering, no DirectionsManager, nothing else —
 * the bundler sees only what this subpath entry re-exports.
 *
 * Endpoints:
 *   GET /search?q=<place name>          → forward geocode
 *   GET /reverse?lat=<lat>&lng=<lng>    → reverse geocode
 *   GET /health                         → health check
 */

import { createServer, IncomingMessage, ServerResponse } from 'node:http';
import { GeocodingManager, AuthManager } from '@gebeta/js/geocoding';
import 'dotenv/config';

// ---------------------------------------------------------------------------
// Auth — prefer service account tokens, fall back to legacy API key
// ---------------------------------------------------------------------------

const { GEBETA_ACCESS_TOKEN, GEBETA_REFRESH_TOKEN, GEBETA_API_KEY, PORT = '3000' } = process.env;

function buildAuth() {
  if (GEBETA_ACCESS_TOKEN && GEBETA_REFRESH_TOKEN) {
    return new AuthManager({
      accessToken: GEBETA_ACCESS_TOKEN,
      refreshToken: GEBETA_REFRESH_TOKEN,
    });
  }
  if (GEBETA_API_KEY) {
    console.warn('[gebeta] Using legacy API key. Migrate to service account auth.');
    return GEBETA_API_KEY;
  }
  throw new Error(
    'Set GEBETA_ACCESS_TOKEN + GEBETA_REFRESH_TOKEN (or legacy GEBETA_API_KEY) in your .env file.'
  );
}

const geocoder = new GeocodingManager(buildAuth());

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function parseQuery(req: IncomingMessage): URLSearchParams {
  const url = new URL(req.url ?? '/', `http://localhost`);
  return url.searchParams;
}

function json(res: ServerResponse, status: number, body: unknown) {
  const payload = JSON.stringify(body, null, 2);
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(payload);
}

// ---------------------------------------------------------------------------
// Request handler
// ---------------------------------------------------------------------------

async function handler(req: IncomingMessage, res: ServerResponse) {
  const path = new URL(req.url ?? '/', `http://localhost`).pathname;

  if (path === '/health') {
    return json(res, 200, { status: 'ok' });
  }

  if (path === '/search') {
    const q = parseQuery(req).get('q')?.trim();
    if (!q) return json(res, 400, { error: 'Missing query param: q' });

    try {
      const results = await geocoder.geocode(q);
      return json(res, 200, { query: q, count: results.length, results });
    } catch (err) {
      return json(res, 502, { error: err instanceof Error ? err.message : String(err) });
    }
  }

  if (path === '/reverse') {
    const params = parseQuery(req);
    const lat = parseFloat(params.get('lat') ?? '');
    const lng = parseFloat(params.get('lng') ?? '');
    if (isNaN(lat) || isNaN(lng)) {
      return json(res, 400, { error: 'Missing or invalid query params: lat, lng' });
    }

    try {
      const results = await geocoder.reverseGeocode({ lat, lng });
      return json(res, 200, { lat, lng, count: results.length, results });
    } catch (err) {
      return json(res, 502, { error: err instanceof Error ? err.message : String(err) });
    }
  }

  return json(res, 404, {
    error: 'Not found',
    endpoints: ['GET /health', 'GET /search?q=<place name>', 'GET /reverse?lat=<lat>&lng=<lng>'],
  });
}

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------

const port = parseInt(PORT, 10);
createServer(handler).listen(port, () => {
  console.log(`Gebeta geocoding API running on http://localhost:${port}`);
  console.log('  GET /search?q=Bole,+Addis+Ababa');
  console.log('  GET /reverse?lat=9.0161&lng=38.7685');
});
