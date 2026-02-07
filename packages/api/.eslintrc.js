module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
  env: {
    node: true,
    es2022: true,
  },
  rules: {
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    // Allow 'any' for platform-agnostic types that will be different types
    // on different platforms (e.g., container: HTMLElement in JS, ReactNode in React)
    '@typescript-eslint/no-explicit-any': 'off',
    // Allow namespaces in the namespaces directory - they're intentionally used for API organization
    '@typescript-eslint/no-namespace': [
      'error',
      {
        allowDeclarations: true,
        allowDefinitionFiles: true,
      },
    ],
  },
  ignorePatterns: ['dist', 'node_modules', '*.js'],
  overrides: [
    {
      files: ['src/namespaces/**/*.ts'],
      rules: {
        // Disable namespace rule for namespace files - they're intentionally using namespaces
        '@typescript-eslint/no-namespace': 'off',
      },
    },
  ],
};
