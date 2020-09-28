const { promisify } = require('util');
const fs = require('fs');
const readdir = promisify(fs.readdir);

const categories = fs.readdirSync('_categories');
const category = categories[0].split('.')[0];


const getAccordionState = async () => {
  return page.$$eval('#main-content .usa-accordion__button', buttons => {
    return buttons.map(button => {
      const answer = document.getElementById(button.getAttribute('aria-controls'));

      return {
        question: button.innerText.trim(),
        answer: answer.innerText.trim(),
        isOpen: button.getAttribute('aria-expanded') === 'true'
      };
    });
  });
};

beforeEach(async () => {
  await page.goto(`http://localhost:4444/${category}/`);
});

test('shows all but the first question collapsed', async () => {
  const questions = await getAccordionState();

  expect(questions[0].isOpen).toBe(true);
  expect(questions.filter(q => q.isOpen)).toHaveLength(1);
});

test('shows a specific question instead of the first if it is passed as an anchor reference', async () => {
  const ids = await page.$$eval('#main-content .usa-accordion__button', els => {
    return els.map(el => el.id)
  });
  const slug = ids[1];

  // browsers have special behavior if you navigate to the same URL with a different hash, so
  // navigate away from the page first
  await page.goto('about:blank');

  // now, navigate to this page
  await page.goto(`http://localhost:4444/${category}/#${slug}`);

  const questions = await getAccordionState();
  expect(questions.length).toBeGreaterThan(1);

  expect(questions[1].isOpen).toBe(true);
  expect(questions.filter(q => q.isOpen)).toHaveLength(1);
});

test('changes page hash on question click', async () => {
  const allButtonIds = await page.$$eval('#main-content .usa-accordion__button', els => {
    return els.map(el => el.id)
  });
  const ids = await page.$$eval('#main-content .usa-accordion__button[set-page-hash]', els => {
    return els.map(el => el.id)
  });

  // All accordion buttons on the category pages should have the set-page-hash attribute
  expect(allButtonIds.length).toBe(ids.length);

  // Click events on accordion buttons should set the page URL to the button's hash
  for (const id of ids) {
    await page.click('#' + id);
    expect(page.url().endsWith('#' + id)).toBe(true);
  }
});
