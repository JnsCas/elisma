module.exports = {
  preset: 'ts-jest/presets/js-with-ts',
  bail: true,
  testEnvironment: 'node',
  globalSetup: './test/setup.ts',
  testMatch: ['**/test/**/*.test.ts', '**/test/**/*.test.js'],
  moduleNameMapper: {
    '^@quorum/elisma/src/(.*)$': '<rootDir>/src/$1',
    '^@quorum/elisma/test/(.*)$': '<rootDir>/test/$1',
  },
  testTimeout: 15000,
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 70,
      lines: 80,
      statements: 0,
    },
  },
}