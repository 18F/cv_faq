const helpers = require('./support/built-site-helpers');
const { promisify } = require('util');
const fs = require('fs');
const path = require('path');
const readFile = promisify(fs.readFile);
const parseFrontMatter = require('front-matter');

const categoryDirectory = '_categories';
const agencyDirectory = '_agencies';

const contentDirectory = '_content';
let questionFiles;
let categoryFiles;
let categoryQuestions = [];

beforeAll(async () => {
  const questionFilenames = await helpers.getAllFilesInDirectory(contentDirectory);
  questionFiles = await Promise.all(questionFilenames.map(async (filename) => {
    const content = await readFile(filename, 'utf8');
    return {
      filename,
      content,
      frontMatter: parseFrontMatter(content).attributes
    };
  }));

  const categoryFilenames = await helpers.getAllFilesInDirectory(categoryDirectory);
  categoryFiles = await Promise.all(categoryFilenames.map(async (filename) => {
    const content = await readFile(filename, 'utf8');
    return {
      filename,
      content,
      frontMatter: parseFrontMatter(content).attributes
    };
  }));

  categoryFiles.forEach(categoryFile => {
    categoryFile.frontMatter.questions.forEach(questionBaseName => {
      categoryQuestions.push([categoryFile.frontMatter.name, questionBaseName]);
    })
  });
});

test('every question is mapped to at least one category', () => {
  questionFiles.forEach(questionFile => {
    const baseName = path.basename(questionFile.filename, '.md');
    let categoryCount = 0;
    categoryFiles.forEach(async (categoryFile) => {
      if (categoryFile.frontMatter.questions.includes(baseName)) {
        categoryCount += 1;
      }
    });
    expect(categoryCount, `${baseName} has at least one category`).toBeGreaterThan(0);
  });
});

test('every category question refers to one question that exists', () => {
  categoryQuestions.forEach(([category, question]) => {
    let questionCount = 0;
    questionFiles.forEach(async (questionFile) => {
      const baseName = path.basename(questionFile.filename, '.md');
      if (question === baseName) {
        questionCount += 1;
      }
    });
    expect(questionCount, `there is one question that matches ${category}:${question}`).toEqual(1);
   });
});

test(`every question's source references an agency that exists in ${agencyDirectory}`, async () => {
  const agencies = await helpers.getAllFilesInDirectory(agencyDirectory);

  questionFiles.forEach(file => {
    sources = file.frontMatter.sources.forEach(source => {
      const expectedAgencyFile = `${path.join(agencyDirectory, source.agency)}.md`;
      expect(agencies).toContain(expectedAgencyFile);
    })
  });
})
