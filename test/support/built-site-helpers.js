const path = require('path');
const { trueCasePath } = require('true-case-path');

const cwd = `${process.cwd()}${path.sep}`;
const isFolder = (path) => path[path.length - 1] === '/';

module.exports = {
  convertRelativeUrlToPath: (relativeUrl) => {
    const prefix = '_site';
    const suffix = isFolder(relativeUrl) ? 'index.html' : '';

    return `${prefix}${relativeUrl}${suffix}`;
  },
  getProperlyCasedRealPath: async (path) => {
    const realPath = await trueCasePath(path);
    return realPath.replace(cwd, '');
  }
};
