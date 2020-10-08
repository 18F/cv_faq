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
});

test('every category contains only expected frontmatter', async () => {
  const expectedKeys = [
    'banner',
    'layout',
    'name',
    'owner',
    'questions',
    'redirect_from',
    'title',
  ];
  categoryFiles.forEach(categoryFile => {
    Object.keys(categoryFile.frontMatter).forEach(property => {
      expect(expectedKeys, `Unexpected property "${property}" in ${categoryFile.filename}"`).toContain(property);
    })
  });
});

test('every question contains only expected frontmatter', async () => {
  const expectedKeys = [
    'date',
    'excerpt',
    'hide_search_in_header',
    'layout',
    'redirect_from',
    'sources',
    'title',
  ];
  questionFiles.forEach(questionFile => {
    Object.keys(questionFile.frontMatter).forEach(property => {
      expect(expectedKeys, `Unexpected property "${property}" in ${questionFile.filename}"`).toContain(property);
    })
  });
});

test('every question contains required frontmatter', async () => {
  const requiredKeys = [
    'date',
    'excerpt',
    'layout',
    'sources',
    'sources.0.agency',
    'sources.0.url',
    'title',
  ];
  questionFiles.forEach(questionFile => {
    requiredKeys.forEach(property => {
      expect(questionFile.frontMatter, `Expected property "${property}" in ${questionFile.filename}" not found`).toHaveProperty(property);
    });
  });
});

test('every category contains required frontmatter', async () => {
  const requiredKeys = [
    'banner',
    'banner.content',
    'banner.display',
    'banner.heading',
    'layout',
    'name',
    'owner',
    'questions',
    'questions.0',
    'title',
  ];
  categoryFiles.forEach(categoryFile => {
    requiredKeys.forEach(property => {
      expect(categoryFile.frontMatter, `Expected property "${property}" in ${categoryFile.filename}" not found`).toHaveProperty(property);
    });
  });
});
