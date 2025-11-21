const path = require('path');

const config = require('@folio/jest-config-stripes');

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
