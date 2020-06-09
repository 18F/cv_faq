import { SearchService } from '../services/search';

export const initSearchResults = () => {
  const searchResultsContainer = document.getElementById('search-results');
  if (!searchResultsContainer) {
    return;
  }

  const searchParams = new URLSearchParams(window.location.search);
  const query = searchParams.get('query');
  const routedFrom = searchParams.get('source');

  const highlightSearchTerms = !routedFrom;
  SearchService(query, highlightSearchTerms).then((response) => {
    if (response.routeTo) {
      window.location.replace(response.routeTo);
    }
    else {
      renderResults(searchResultsContainer, query, response.results, routedFrom);
    }
  });
};

const renderResults = (searchResultsContainer, query, results, routedFrom) => {
  searchResultsContainer.innerHTML = '';

  if (routedFrom) {
    searchResultsContainer.innerHTML += `
      <h2 class="title">We’re sorry! We found 0 results for “${routedFrom}.”</h2>
      <h2 class="title">However, we found results for the related term “${query}.”</h2>
    `;
  }

  if (!results.length) {
    searchResultsContainer.innerHTML += `<h2 class="title">No results found</h2>`;
  }
  else {
    searchResultsContainer.innerHTML += `
      <ol>
        ${results.map(renderResults_result(routedFrom)).join('')}
      </ol>
    `;
  }
};

const continueReading = (result) => {
  if (result.description) {
    return `... <span class="read-more">Continue reading</span>`;
  }
  return '';
}

const renderResults_result = (routedFrom) => (result) => {
  return `
    <li>
      <a href="${result.url}">
        <h2 class="title">${highlight(result.title, routedFrom)}</h2>
        <p>${highlight(result.description, routedFrom)}${continueReading(result)}</p>
      </a>
    </li>
  `;
};

const highlight = (text, routedFrom) => {
  // Don't highlight text on routed search URLs
  if (routedFrom) {
    return text;
  }
  return text.replace(/\uE000/g, '<span class="bg-yellow">').replace(/\uE001/g, '</span>');
};
