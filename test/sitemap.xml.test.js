const { promisify } = require('util');
const readFile = promisify(require('fs').readFile);
const parser = require('fast-xml-parser');
const helpers = require('./support/built-site-helpers');

test('sitemap.xml contains valid URLs', async () => {
  const xml = await readFile('./_site/sitemap.xml', 'utf8');
  const sitemap = parser.parse(xml, {}, true);
  const entries = sitemap.urlset.url;

  const paths = entries.map(entry => {
    const relativeUrl = entry.loc.replace('http://0.0.0.0:4000', '').replace('https://faq.coronavirus.gov', '');
    return helpers.convertRelativeUrlToPath(relativeUrl);
  });

  return await Promise.all(paths.map(async (requestedPath) => {
    const realPath = await helpers.getProperlyCasedRealPath(requestedPath);
    expect(requestedPath).toBe(realPath);
  }));
});
