// App.tsx — root component with hash-based client-side routing.

import { useState, useEffect } from 'react';
import Home from './pages/Home';
import Geocoding from './pages/Geocoding';
import Directions from './pages/Directions';
import Clustering from './pages/Clustering';
import Fencing from './pages/Fencing';
import { fetchAuth, type Auth } from './config';

type RouteComponent = React.ComponentType<{ auth: Auth }> | React.ComponentType;

const routes: Record<string, RouteComponent> = {
  '/': Home,
  '/geocoding': Geocoding,
  '/directions': Directions,
  '/clustering': Clustering,
  '/fencing': Fencing,
};

export default function App() {
  const [hash, setHash] = useState(window.location.hash);
  const [auth, setAuth] = useState<Auth | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    fetchAuth().then(setAuth).catch(err => setAuthError(String(err)));
  }, []);

  useEffect(() => {
    function onHashChange() {
      setHash(window.location.hash);
    }
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const route = hash.replace(/^#/, '') || '/';
  const Page = routes[route] ?? Home;

  if (authError) {
    return (
      <div style={{ padding: 40, fontFamily: 'monospace', color: '#c00' }}>
        <strong>Auth error:</strong> {authError}
        <p style={{ color: '#555', fontSize: 13 }}>
          Make sure the node-auth server is running and VITE_GEBETA_CLIENT_TOKEN is set.
        </p>
      </div>
    );
  }

  if (!auth) {
    return (
      <div style={{ padding: 40, fontFamily: 'monospace', color: '#555' }}>
        Authenticating…
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      {route !== '/' && (
        <a
          href="#/"
          style={{
            position: 'absolute',
            bottom: 12,
            right: 12,
            zIndex: 2000,
            background: 'white',
            color: '#007cbf',
            textDecoration: 'none',
            padding: '6px 12px',
            borderRadius: 6,
            fontSize: 13,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            border: '1px solid #e9ecef',
          }}
        >
          ← Back to examples
        </a>
      )}
      <Page auth={auth} />
    </div>
  );
}
