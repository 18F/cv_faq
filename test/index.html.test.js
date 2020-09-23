
beforeAll(async () => {
  await page.goto('http://localhost:4444/');
});

test('all six top questions have an icon and text', async () => {
  const questions = await page.$$eval('.top-questions .question', elements => {
    return elements.map(q => { return {
      text: q.innerText.trim(),
      src: q.querySelector('img').src
    }});
  });

  expect(questions).toHaveLength(6);

  questions.forEach(({text, src}) => {
    expect(text).not.toEqual('');

    // Asserts a fingerprint has been calculated for this asset, therefore it
    // has been found in the build process.
    expect(src).toMatch(/\/assets\/.+-.{64}\.svg/);
  });
});

test('both question boxes have three content links and a view all link', async () => {
  const boxes = await page.$$eval('.question-box', elements => {
    return elements.map(b => {
      const getText = (el) => el ? el.innerText.trim().replace(/\n/g, ' ') : null;

      return {
        title: getText(b.querySelector('.question-title')),
        questions: [...b.querySelectorAll('li')].map(getText),
        viewAllText: getText(b.querySelector('.view-all'))
      };
    });
  });

  expect(boxes).toHaveLength(2);

  boxes.forEach(({title, questions, viewAllText}) => {
    expect(title).not.toEqual('');
    expect(questions).toHaveLength(3);

    // Assert that the view all text (including the screen reader text) is present.
    expect(viewAllText).toContain(`View all questions about ${title}`);
  });
});

test('the displayed categories have content links and a description', async () => {
  const category_groupings = await page.$$eval('.top-categories .top-category', elements => {
    return elements.map(b => {
      const getText = (el) => el ? el.innerText.trim().replace(/\n/g, '') : null;

      return {
        title: getText(b.querySelector('h3')),
        description: getText(b.querySelector('p')),
        categories: [...b.querySelectorAll('li')].map(getText)
      };
    });
  });

  expect(category_groupings).toHaveLength(6);

  category_groupings.forEach(({title, description, categories}) => {
    expect(title).not.toEqual('');
    expect(description).not.toEqual('');
    expect(categories.length).toBeGreaterThan(1);
  });
});
