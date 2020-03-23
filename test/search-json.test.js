const path = require('path');
const { trueCasePath } = require('true-case-path');

const convertRelativeUrlToPath = (relativeUrl) => {
  const prefix = '_site';
  const suffix = isFolder(relativeUrl) ? 'index.html' : '';

  return `${prefix}${relativeUrl}${suffix}`;
};

const isFolder = (path) => path[path.length - 1] === '/';

test('search.json contains valid URLs', async () => {
  const search = require('../_site/search.json');
  const paths = search.map(item => convertRelativeUrlToPath(item.url));
  const cwd = `${process.cwd()}${path.sep}`;

  return await Promise.all(paths.map(async (requestedPath) => {
    const pathOnFilesystem = await trueCasePath(requestedPath);
    const relativePathOnFilesystem = pathOnFilesystem.replace(cwd, '');
    expect(requestedPath).toBe(relativePathOnFilesystem);
  }));
});
