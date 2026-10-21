module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        tsconfig: {
          moduleResolution: 'node',
          lib: ['ES2020', 'DOM'],
          types: ['jest', 'node'],
        },
      },
    ],
  },
  transformIgnorePatterns: ['node_modules/(?!(supercluster|kdbush)/)'],
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        tsconfig: {
          moduleResolution: 'node',
          lib: ['ES2020', 'DOM'],
          types: ['jest', 'node'],
        },
      },
    ],
    '^.+\\.js$': [
      'ts-jest',
      {
        tsconfig: {
          moduleResolution: 'node',
          lib: ['ES2020', 'DOM'],
          types: ['jest', 'node'],
        },
      },
    ],
  },
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts', '!src/**/__tests__/**'],
  moduleNameMapper: {
    '^@gebeta/api$': '<rootDir>/../api/src/index.ts',
  },
  moduleFileExtensions: ['ts', 'js', 'json'],
  extensionsToTreatAsEsm: [],
};
