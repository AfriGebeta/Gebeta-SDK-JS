/**
 * Metro/babel inlines `process.env.*` string literals at build time, but React Native's
 * runtime (Hermes) has no full Node `process`. Declare only the `env` shape the example
 * reads, rather than pulling in all of `@types/node` (which would advertise Node globals
 * that don't exist on-device).
 */
declare const process: {
  env: {
    GEBETA_API_KEY?: string;
    [key: string]: string | undefined;
  };
};
