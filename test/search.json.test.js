const helpers = require('./support/built-site-helpers');

test('search.json contains valid URLs', async () => {
  const search = require('../_site/search.json');
  const paths = search.map(item => helpers.convertRelativeUrlToPath(item.url));

  return await Promise.all(paths.map(async (requestedPath) => {
    const realPath = await helpers.getProperlyCasedRealPath(requestedPath);
    expect(requestedPath).toBe(realPath);
  }));
});
