import { html, render } from 'lit-html';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';

import { SearchService } from '../services/search';

const SEARCH_RESULTS_ID = 'search-results-container';


let searchResultsContainer;


/**
 * Generator that yields search result pages from SearchService.
 * @param {String} query         Query string
 * @param {String} routedFrom    If routed query, the original search terms
 * @yield {Object} Page as returned by SearchService.
 */
const searchPageGenerator = async function* (query, routedFrom) {
  let nextOffset = null;
  let resultsPages = [];

  let response;
  do {
    response = await SearchService({
      query,
      offset: nextOffset,
      // Only request highlighted terms if they correspond to what the user
      // typed (ie, not routed queries).
      highlightSearchTerms: !routedFrom,
      // If first page, fallback to local search after a 3 second timeout
      searchTimeoutSeconds: resultsPages.length ? null : 3
    });
    nextOffset = response.nextOffset;
    if (response.routeTo) {
      window.location.replace(response.routeTo);
      return;
    }
    else {
      yield response;
    }
  } while (response.nextOffset);
}


export const initSearchResults = () => {
  searchResultsContainer = document.getElementById(SEARCH_RESULTS_ID);
  if (!searchResultsContainer) {
    return;
  }

  const searchParams = new URLSearchParams(window.location.search);
  const query = searchParams.get('query');
  const routedFrom = searchParams.get('source');

  let resultsPages = [];

  const pages = searchPageGenerator(query, routedFrom);

  const renderNextPage = async () => {
    const nextPage = await pages.next();
    resultsPages.push(nextPage.value);
    render(searchTemplate({
      resultsPages,
      query,
      routedFrom,
      renderNextPage
    }), searchResultsContainer);
  };
  renderNextPage();
};

const searchTemplate = ({
  resultsPages,
  query,
  routedFrom,
  renderNextPage
}) => {
  const lastPage = resultsPages[resultsPages.length - 1];
  const resultsCount = lastPage.resultsCount;
  const nextOffset = lastPage.nextOffset;
  return html`
    <div class="usa-prose">
      <h1>
        Search Results
        ${resultsCount ? html`<span class="num-results">(${resultsCount})</span>` : null}
      </h1>
    </div>
    ${resultsCount ? renderResultsSummaryTemplate(nextOffset, resultsCount) : null}
    ${routedFrom ? routedQueryIntroTemplate(routedFrom, query) : null}
    <div id="search-results">
      ${resultsCount ? html`<ol class="results-list">
        ${resultsPages.map(page => page.results.map(renderResultTemplate))}
      </ol>` : html`<h2 class="title">No results found</h2>`}
    </div>
    <p class="button-container">
      ${resultsCount ? renderResultsSummaryTemplate(nextOffset, resultsCount) : null}
      ${nextOffset ? html`
        <button class="usa-button more-results-button" @click=${renderNextPage}>
          Load more
        </button>` : null}
    </p>
  `;
}

const renderResultsSummaryTemplate = (nextOffset, resultsCount) => html`
  <div class="results-summary">
    Displaying 1-${nextOffset ? nextOffset - 1 : resultsCount} of ${resultsCount}
  </div>
`;

const routedQueryIntroTemplate = (routedFrom, query) => html`
  <div class="routed-query">
    <h2 class="title">We’re sorry! We found 0 results for “${routedFrom}.”</h2>
    <h2 class="title">However, we found results for the related term “${query}.”</h2>
  </div>
`;

const continueReading = (result) => {
  if (result.description) {
    return html`... <span class="read-more">Continue reading</span>`;
  }
  return null;
}

const renderResultTemplate = (result) => html`
  <li>
    <a href="${result.url}">
      <h2 class="title">${highlight(result.title)}</h2>
      <p>${highlight(result.description)}${continueReading(result)}</p>
    </a>
  </li>
`;

const highlight = (text) => unsafeHTML(
  text.replace(/\uE000/g, '<span class="bg-yellow">').replace(/\uE001/g, '</span>')
);
