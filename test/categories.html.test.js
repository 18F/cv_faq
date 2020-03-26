const { promisify } = require('util');
const fs = require('fs');
const readdir = promisify(fs.readdir);

const categories = fs.readdirSync('_categories');
const category = categories[0].split('.')[0];

beforeAll(async () => {
  await page.goto(`http://localhost:4444/${category}/`);
});

test('shows all but the first question collapsed', async () => {
  const contentFiles = await readdir(`_content/${category}`);
  const questions = await page.$$eval('#main-content .usa-accordion__button', buttons => {
    return buttons.map(button => {
      const answer = document.getElementById(button.getAttribute('aria-controls'));

      return {
        question: button.innerText.trim(),
        answer: answer.innerText.trim(),
        isOpen: button.getAttribute('aria-expanded') === 'true'
      };
    });
  });

  expect(questions).toHaveLength(contentFiles.length);
  expect(questions[0].isOpen).toBe(true);
  expect(questions.filter(q => q.isOpen)).toHaveLength(1);
});
