const helpers = require('./support/built-site-helpers');

test('suggestions.json contains an array of search terms', async () => {
  const suggestions = require('../_site/suggestions.json');
  suggestions.forEach(item => expect(typeof item).toBe('string'));
});
