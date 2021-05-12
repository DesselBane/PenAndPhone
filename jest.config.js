module.exports = {
  globals: {
    'ts-jest': {
      diagnostics: {
        warnOnly: true,
      },
    },
  },
  setupFilesAfterEnv: ['jest-extended'],
  testMatch: ['**/(*.)unit.ts'],
  transform: {
    '^.+\\.vue$': 'vue-jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    ...require('./aliases.config').jest,
  },
}
