const helpers = require('./support/built-site-helpers');
const { promisify } = require('util');
const fs = require('fs');
const path = require('path');
const readFile = promisify(fs.readFile);
const parseFrontMatter = require('front-matter');

const categoryDirectory = '_categories';
const agencyDirectory = '_agencies';

const contentDirectory = '_content';
let contentFiles;

beforeAll(async () => {
  const filenames = await helpers.getAllFilesInDirectory(contentDirectory);

  contentFiles = await Promise.all(filenames.map(async (filename) => {
    const content = await readFile(filename, 'utf8');
    return {
      filename,
      content,
      frontMatter: parseFrontMatter(content).attributes
    };
  }));
})

test('every question file is in a directory which matches its category', () => {
  contentFiles.forEach(file => {
    const expectedFolder = `${path.join(contentDirectory, file.frontMatter.category)}${path.sep}`;
    expect(file.filename).toContain(expectedFolder);
  });
});

test(`every question references a category that exists in ${categoryDirectory}`, async () => {
  const categories = await helpers.getAllFilesInDirectory(categoryDirectory);

  contentFiles.forEach(file => {
    const expectedCategoryFile = `${path.join(categoryDirectory, file.frontMatter.category)}.md`;
    expect(categories).toContain(expectedCategoryFile);
  });
})

test(`every question's source references an agency that exists in ${agencyDirectory}`, async () => {
  const agencies = await helpers.getAllFilesInDirectory(agencyDirectory);

  contentFiles.forEach(file => {
    const expectedAgencyFile = `${path.join(agencyDirectory, file.frontMatter.source)}.md`;
    expect(agencies).toContain(expectedAgencyFile);
  });
})
