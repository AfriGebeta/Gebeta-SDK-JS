export { API } from './namespaces';

// Re-export individual namespaces for convenience
export * as Common from './namespaces/common';
export * as Map from './namespaces/map';
export * as Clustering from './namespaces/clustering';
export * as Routing from './namespaces/routing';
export * as Navigation from './namespaces/navigation';
export * as Tracking from './namespaces/tracking';
export * as Geocoding from './namespaces/geocoding';
export * as Fencing from './namespaces/fencing';
export * as Overlay from './namespaces/overlay';
export * as Components from './namespaces/components';
export * as Events from './namespaces/events';
export * as Platform from './namespaces/platform';

// Re-export errors directly for convenience
export * from './errors';
