module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom', // Browser environment for JS SDK
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        tsconfig: {
          moduleResolution: 'bundler',
          lib: ['ES2020', 'DOM'],
          types: ['jest', 'node'],
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
        },
      },
    ],
  },
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts', '!src/**/__tests__/**', '!src/index.ts'],
  transformIgnorePatterns: ['node_modules/(?!(supercluster|kdbush)/)'],
  moduleNameMapper: {
    '^@gebeta/api$': '<rootDir>/../../api/src/index.ts',
    '^@gebeta/core$': '<rootDir>/../../core/src/index.ts',
    '^maplibre-gl$': '<rootDir>/src/__mocks__/maplibre-gl.ts',
  },
  moduleFileExtensions: ['ts', 'js', 'json'],
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts'],
};
