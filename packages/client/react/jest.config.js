module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.{ts,tsx}', '**/?(*.)+(spec|test).{ts,tsx}'],
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: {
          moduleResolution: 'bundler',
          lib: ['ES2020', 'DOM'],
          types: ['jest', 'node'],
          jsx: 'react-jsx',
          allowJs: true,
        },
      },
    ],
    '^.+\\.js$': [
      'ts-jest',
      {
        tsconfig: {
          moduleResolution: 'bundler',
          lib: ['ES2020', 'DOM'],
          types: ['jest', 'node'],
          allowJs: true,
        },
      },
    ],
  },
  transformIgnorePatterns: ['node_modules/(?!(supercluster|kdbush)/)'],
  moduleNameMapper: {
    '^@gebeta/api$': '<rootDir>/../../api/src/index.ts',
    '^@gebeta/core$': '<rootDir>/../../core/src/index.ts',
    '^maplibre-gl$': '<rootDir>/src/__mocks__/maplibre-gl.ts',
    '\\.css$': '<rootDir>/src/__mocks__/styleMock.js',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
};
