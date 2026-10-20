---
"@gebeta/api": minor
"@gebeta/core": minor
"@gebeta/js": minor
"@gebeta/react": minor
"@gebeta/node": minor
"@gebeta/react-native": minor
---

Rename `GebetaMap` component to `GebetaMaps` for consistency with the JS SDK class name.

**Breaking change:** The React and React Native component export has been renamed.

```diff
- import { GebetaMap, type GebetaMapProps, type GebetaMapRef } from '@gebeta/react';
+ import { GebetaMaps, type GebetaMapsProps, type GebetaMapsRef } from '@gebeta/react';

- import { GebetaMap, type GebetaMapProps } from '@gebeta/react-native';
+ import { GebetaMaps, type GebetaMapsProps } from '@gebeta/react-native';
```

JSX usage:
```diff
- <GebetaMap apiKey="..." />
+ <GebetaMaps apiKey="..." />
```
