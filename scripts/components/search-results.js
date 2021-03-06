import { html, render } from 'lit-html';
import { live } from 'lit-html/directives/live.js';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';

import { trackClick, SearchService } from '../services/search';

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
  do {
    const response = await SearchService({
      query,
      offset: nextOffset,
      // Only request highlighted terms if they correspond to what the user
      // typed (ie, not routed queries).
      highlightSearchTerms: !routedFrom,
      localFallback: nextOffset === null,
    });
    nextOffset = response.nextOffset;
    if (response.routeTo) {
      window.location.replace(response.routeTo);
      return;
    }
    else {
      yield response;
    }
  } while (nextOffset);
};

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
    resultsPages.push((await pages.next()).value);
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
  const firstPage = resultsPages[0];
  const lastPage = resultsPages[resultsPages.length - 1];
  const resultsCount = lastPage.resultsCount;
  const nextOffset = lastPage.nextOffset;
  const bestBets = firstPage.bestBets;
  return html`
    <div class="usa-prose">
      <h1>
        Search Results
        ${resultsCount ? html`<span class="num-results">(${resultsCount})</span>` : null}
      </h1>
    </div>
    ${resultsCount ? renderResultsSummaryTemplate(nextOffset, resultsCount) : null}
    ${bestBets && bestBets.length ? html`
      <div id="best-bets" class="padding-2 border-1px border-base-lightest margin-top-3 margin-bottom-3">
        <div>Recommended</div>
        <ol class="results-list">
          ${bestBets.map(renderResultTemplate(query))}
        </ol>
      </div>
    ` : null}
    <div id="search-results">
      ${!resultsCount || routedFrom ? html`
        <h2 class="title">We’re sorry! We couldn’t find any results for <em>${routedFrom || query}</em>.</h2>
      ` : null}
      ${routedFrom ? html`
        <h2 class="title">However, we found results for the related term <em>${query}</em>.</h2>
      ` : null}
    </div>
    ${!resultsCount ? html`
        Try your search again following these tips:
        <ul>
          <li>Check your spelling</li>
          <li>Try a different keyword</li>
          <li>Use a more general keyword</li>
        </ul>
      ` : null
    }
    ${resultsCount ?
      html`<ol class="results-list">
        ${resultsPages.map(page => page.results.map(renderResultTemplate(query)))}
      </ol>` : null
    }
    <p class="button-container">
      ${resultsCount ? renderResultsSummaryTemplate(nextOffset, resultsCount) : null}
      ${nextOffset ? html`
        <button class="usa-button more-results-button" ?disabled=${live(!nextOffset)} @click=${(event) => {
          event.target.disabled = true;
          renderNextPage()
        }}>
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

const continueReading = (result) => {
  if (result.description) {
    return html`... <span class="read-more">Continue reading</span>`;
  }
  return null;
}

const renderResultTemplate = (query) => (result, position) => html`
  <li>
    <a href="${result.url}?ctquery=${window.encodeURIComponent(query)}&ctposition=${position + 1}">
      <h2 class="title">${highlight(result.title)}</h2>
      <p>${highlight(result.description)}${continueReading(result)}</p>
    </a>
  </li>
`;

const highlight = (text) => unsafeHTML(
  text.replace(/\uE000/g, '<span class="bg-yellow">').replace(/\uE001/g, '</span>')
);
