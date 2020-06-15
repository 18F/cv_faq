import { SearchService } from '../services/search';

const SEARCH_RESULTS_ID = 'search-results';

export const initSearchResults = () => {
  const searchResultsContainer = document.getElementById(SEARCH_RESULTS_ID);
  if (!searchResultsContainer) {
    return;
  }

  const searchParams = new URLSearchParams(window.location.search);
  const query = searchParams.get('query');
  const routedFrom = searchParams.get('source');

  let nextOffset = null;

  searchResultsContainer.classList.toggle('is-loading', true);
  SearchService({
    query,
    highlightSearchTerms: !routedFrom,
    searchTimeoutSeconds: 3
  }).then((response) => {
    nextOffset = response.nextOffset;
    if (response.routeTo) {
      window.location.replace(response.routeTo);
    }
    else {
      renderResults({
        searchResultsContainer,
        results: response.results,
        resultsCount: response.resultsCount,
        nextOffset,
        query,
        routedFrom
      });
    }
  });

  searchResultsContainer.querySelector('.more-results-button').addEventListener('click', () => {
    if (!nextOffset) {
      return;
    }
    SearchService({
      query,
      offset: nextOffset,
      highlightSearchTerms: !routedFrom,
      searchTimeoutSeconds: null
    }).then((response) => {
      nextOffset = response.nextOffset;
      renderResults({
        searchResultsContainer,
        results: response.results,
        resultsCount: response.resultsCount,
        nextOffset,
        query,
        routedFrom
      });
    });
  });
};

const renderResults = ({
  searchResultsContainer,
  results,
  resultsCount,
  nextOffset,
  query,
  routedFrom
}) => {
  searchResultsContainer.classList.toggle('is-routed-query', !!routedFrom);
  searchResultsContainer.classList.toggle('has-more-results', !!nextOffset);
  searchResultsContainer.classList.toggle('is-loading', false);

  if (resultsCount) {
    const resultsHeader = searchResultsContainer.querySelector('.results-header');
    resultsHeader.innerHTML = `
      <div class="grid-col-fill">
        <h1>Search Results <span class="num-results">(${resultsCount})</span></h1>
      </div>
    `;
    if (nextOffset) {
      resultsHeader.innerHTML += `
        <div class="results-summary grid-col-auto">Displaying 1-${nextOffset - 1} of ${resultsCount}</div>
      `;
    }
  }

  searchResultsContainer.querySelector('.routed-from').innerHTML = routedFrom;
  searchResultsContainer.querySelector('.query').innerHTML = query;

  if (!results.length) {
    searchResultsContainer.innerHTML += `<div>No results found</div>`;
  }
  else {
    searchResultsContainer.querySelector('ol.results-list').innerHTML += results.map(
      renderResults_result()
     ).join('');
  }
};

const continueReading = (result) => {
  if (result.description) {
    return `... <span class="read-more">Continue reading</span>`;
  }
  return '';
}

const renderResults_result = () => (result) => {
  return `
    <li>
      <a href="${result.url}">
        <h2 class="title">${highlight(result.title)}</h2>
        <p>${highlight(result.description)}${continueReading(result)}</p>
      </a>
    </li>
  `;
};

const highlight = (text) => {
  return text.replace(/\uE000/g, '<span class="bg-yellow">').replace(/\uE001/g, '</span>');
};
