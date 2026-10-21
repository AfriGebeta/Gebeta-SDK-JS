// Home.tsx — landing page with links to all examples.

const examples = [
  {
    route: '/geocoding',
    title: 'Geocoding',
    import: "import { GebetaMap } from '@gebeta/react'",
    description:
      'Forward and reverse geocoding. Search by place name or look up an address from coordinates.',
  },
  {
    route: '/directions',
    title: 'Directions',
    import: "import { GebetaMap } from '@gebeta/react'",
    description: 'Click the map to set origin and destination, then get and display a route.',
  },
  {
    route: '/navigation',
    title: 'Navigation',
    import: "import { GebetaMap, BrowserLocationProvider } from '@gebeta/react'",
    description:
      'Turn-by-turn navigation with progress, ETA, and off-route detection. Choose simulated or real GPS.',
  },
  {
    route: '/clustering',
    title: 'Marker Clustering',
    import: "import { GebetaMap, useClustering } from '@gebeta/react'",
    description: 'Add random markers and see them cluster. Controls for radius and max zoom.',
  },
  {
    route: '/fencing',
    title: 'Fencing',
    import: "import { GebetaMap } from '@gebeta/react'",
    description: 'Draw geofences by clicking on the map. Close the fence to complete a polygon.',
  },
];

export default function Home() {
  return (
    <div
      style={{
        width: '100%',
        minHeight: '100%',
        background: '#f8f9fa',
        overflowY: 'auto',
        padding: 20,
      }}
    >
      <div
        style={{
          maxWidth: 900,
          margin: '0 auto',
          background: 'white',
          padding: 30,
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        }}
      >
        <h1 style={{ color: '#333', textAlign: 'center', margin: '0 0 10px 0', fontSize: 28 }}>
          Gebeta Maps SDK
        </h1>
        <p style={{ textAlign: 'center', color: '#666', margin: '0 0 30px 0', fontSize: 15 }}>
          React examples using{' '}
          <code
            style={{
              background: '#f0f4f8',
              padding: '2px 6px',
              borderRadius: 4,
              fontSize: 13,
              color: '#007cbf',
            }}
          >
            @gebeta/react
          </code>
          .
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 16,
            marginBottom: 30,
          }}
        >
          {examples.map(ex => (
            <a
              key={ex.route}
              href={`#${ex.route}`}
              style={{
                border: '1px solid #e9ecef',
                borderRadius: 8,
                padding: 18,
                textDecoration: 'none',
                color: 'inherit',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              <h3 style={{ margin: 0, color: '#007cbf', fontSize: 16 }}>{ex.title}</h3>
              <code
                style={{
                  fontSize: 11,
                  background: '#f0f4f8',
                  color: '#555',
                  padding: '4px 6px',
                  borderRadius: 4,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  display: 'block',
                }}
              >
                {ex.import}
              </code>
              <p style={{ margin: 0, color: '#666', fontSize: 13, lineHeight: 1.5 }}>
                {ex.description}
              </p>
            </a>
          ))}
        </div>
        <div
          style={{
            background: '#fff3cd',
            borderRadius: 8,
            borderLeft: '4px solid #ffc107',
            padding: '16px 20px',
            fontSize: 13,
            color: '#333',
            lineHeight: 1.6,
          }}
        >
          <strong>Auth setup:</strong> Start the node-auth server, then set{' '}
          <code style={{ background: '#eee', padding: '2px 5px', borderRadius: 3, fontSize: 12 }}>
            VITE_GEBETA_CLIENT_TOKEN
          </code>{' '}
          in{' '}
          <code style={{ background: '#eee', padding: '2px 5px', borderRadius: 3, fontSize: 12 }}>
            apps/react/.env
          </code>
          :
          <pre
            style={{
              background: '#f4f4f4',
              padding: 10,
              borderRadius: 4,
              fontSize: 12,
              overflowX: 'auto',
              margin: '8px 0',
            }}
          >
            {`VITE_GEBETA_CLIENT_TOKEN=your_client_token`}
          </pre>
          Build the SDK first with{' '}
          <code style={{ background: '#eee', padding: '2px 5px', borderRadius: 3, fontSize: 12 }}>
            yarn build
          </code>
          , start the auth server with{' '}
          <code style={{ background: '#eee', padding: '2px 5px', borderRadius: 3, fontSize: 12 }}>
            yarn workspace node-auth dev
          </code>
          , then run{' '}
          <code style={{ background: '#eee', padding: '2px 5px', borderRadius: 3, fontSize: 12 }}>
            yarn workspace react-example dev
          </code>
          .
        </div>
      </div>
    </div>
  );
}
