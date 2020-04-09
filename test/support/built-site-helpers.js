const { promisify } = require('util');
const path = require('path');
const fs = require('fs');
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const { trueCasePath } = require('true-case-path');

const cwd = `${process.cwd()}${path.sep}`;
const isFolder = (path) => path[path.length - 1] === '/';

const getAllFilesInDirectory = async (dir) => {
  const entries = await readdir(dir);
  const files = await Promise.all(entries.map(async (entry) => {
    const fullPath = path.resolve(dir, entry);
    const info = await stat(fullPath);
    return info.isDirectory() ? getAllFilesInDirectory(fullPath) : fullPath;
  }));

  return [].concat(...files).map(f => f.replace(cwd, ''));
};

module.exports = {
  convertRelativeUrlToPath: (relativeUrl) => {
    const prefix = '_site';
    const suffix = isFolder(relativeUrl) ? 'index.html' : '';

    return `${prefix}${relativeUrl}${suffix}`;
  },
  getProperlyCasedRealPath: async (path) => {
    const realPath = await trueCasePath(path);
    return realPath.replace(cwd, '');
  },
  getAllFilesInDirectory,
};
