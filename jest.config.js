const esModules = ['@folio'].join('|');

module.exports = {
  collectCoverageFrom: [
    '**/lib/**/*.{js,jsx}',
    '!**/node_modules/**',
    '!**/test/**',
  ],
  coverageDirectory: '<rootDir>/artifacts/coverage/',
  coverageReporters: ['lcov'],
  reporters: ['jest-junit', 'default'],
  transform: {
    '^.+\\.(js|jsx)$': '<rootDir>/test/jest/jest-transformer.js',
  },
  transformIgnorePatterns: [`/node_modules/(?!${esModules})`],
  moduleNameMapper: {
    '^.+\\.(css)$': '<rootDir>/node_modules/jest-css-modules',
    '^.+\\.(svg)$': 'identity-obj-proxy',
  },
  testMatch: ['<rootDir>/lib/**/?(*.)test.{js,jsx}'],
  testPathIgnorePatterns: ['/node_modules/'],
  setupFiles: ['<rootDir>/test/jest/setupTests.js'],
};
