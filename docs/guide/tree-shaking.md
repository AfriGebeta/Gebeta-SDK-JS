# Tree Shaking

`@gebeta/js` is fully tree-shakeable. Import only what you need to keep your bundle small.

## Subpath imports

Instead of importing everything:

```js
// Pulls in the full SDK (~300 kB)
import { GeocodingManager } from '@gebeta/js';
```

Use a subpath import instead:

```js
// Only geocoding (~45 kB)
import { GeocodingManager } from '@gebeta/js/geocoding';

// Only directions
import { DirectionsManager } from '@gebeta/js/directions';

// Only clustering
import { ClusteringManager } from '@gebeta/js/clustering';

// Only navigation
import { NavigationManager } from '@gebeta/js/navigation';

// Only fencing
import { FenceManager } from '@gebeta/js/fencing';
```

## Available subpaths

| Import                  | Includes                        |
| ----------------------- | ------------------------------- |
| `@gebeta/js`            | Everything                      |
| `@gebeta/js/geocoding`  | GeocodingManager + AuthManager  |
| `@gebeta/js/directions` | DirectionsManager + AuthManager |
| `@gebeta/js/clustering` | ClusteringManager + AuthManager |
| `@gebeta/js/navigation` | NavigationManager + AuthManager |
| `@gebeta/js/fencing`    | FenceManager + AuthManager      |

## Auditing your bundle

Run the bundle analyzer from the repo root:

```bash
yarn bundle:audit <workspace-name>
```

This opens an interactive treemap showing exactly which modules are included and their sizes.
