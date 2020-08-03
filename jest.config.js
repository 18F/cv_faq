module.exports = {
  testMatch: [ '**/test/**/*.test.js' ],
  preset: 'jest-puppeteer',
  setupFilesAfterEnv: ['jest-expect-message']
};
