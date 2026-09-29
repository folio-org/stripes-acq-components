const path = require('path');

const stripesJestConfig = require('@folio/jest-config-stripes');

const config = stripesJestConfig.config || stripesJestConfig;

module.exports = {
  ...config,
  collectCoverageFrom: [
    ...config.collectCoverageFrom,
    `${path.join(__dirname, './experimental')}/**/*.{js,jsx}`,
  ],
  setupFiles: [
    ...config.setupFiles,
    path.join(__dirname, './test/jest/setupFiles.js'),
  ],
};
