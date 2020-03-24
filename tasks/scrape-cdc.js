const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();

  try {
    const page = await browser.newPage();
    const content = await scrapeFaq(page);

    console.log(JSON.stringify(content, null, 2));
  }
  finally {
    await browser.close();
  }
})();

const scrapeFaq = async (page) => {
  await page.goto('https://www.cdc.gov/coronavirus/2019-ncov/faq.html');

  const data = await page.$$eval('.col.content h2', headings => headings.map(heading => {
    const accordion = heading.nextElementSibling;
    const items = Array.from(accordion.querySelectorAll('.card-header'));
    const relativeLinks = accordion.querySelectorAll("a:not([href*='//']");

    relativeLinks.forEach(el => el.href = new URL(el.href, document.baseURI));

    return {
      title: heading.innerText,
      items: items.map(question => {
        return {
          question: question.innerText,
          answer: document.querySelector(`${question.dataset.target} .card-body`).innerHTML.trim()
        };
      })
    };
  }));

  return data;
};
