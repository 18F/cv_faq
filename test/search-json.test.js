const { promisify } = require('util');
const fs = require('fs');
const access = promisify(fs.access);

const convertRelativeUrlToPath = (relativeUrl) => {
  const prefix = './_site';
  const suffix = isFolder(relativeUrl) ? 'index.html' : '';

  return `${prefix}${relativeUrl}${suffix}`;
};

const isFolder = (path) => path[path.length - 1] === '/';

test('search.json contains valid URLs', async () => {
  const search = require('../_site/search.json');
  const paths = search.map(item => convertRelativeUrlToPath(item.url));

  await Promise.all(paths.map(p => access(p)));
});
