// App.tsx — root component with hash-based client-side routing.

import { useState, useEffect } from 'react';
import Home from './pages/Home';
import Geocoding from './pages/Geocoding';
import Directions from './pages/Directions';
import Clustering from './pages/Clustering';
import Fencing from './pages/Fencing';

const routes: Record<string, React.ComponentType> = {
  '/': Home,
  '/geocoding': Geocoding,
  '/directions': Directions,
  '/clustering': Clustering,
  '/fencing': Fencing,
};

export default function App() {
  const [hash, setHash] = useState(window.location.hash);

  useEffect(() => {
    function onHashChange() {
      setHash(window.location.hash);
    }
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const route = hash.replace(/^#/, '') || '/';
  const Page = routes[route] ?? Home;

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
      <Page />
    </div>
  );
}
