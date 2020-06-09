import {
  BASE_URL, RESULTS_LIMIT, SEARCHGOV_ACCESS_KEY, SEARCHGOV_AFFILIATE,
  SEARCHGOV_ENDPOINT
} from './constants';


const translateFromSearchGov = (query) => (response) => {
  return {
    routeTo: (() => {
      if (!response.route_to) {
        return null;
      }

      // If this is a routed query pointing to production search results, extract
      // search parameters out.
      // So we can test lower environments against the production search.gov,
      // assume production hostname.
      const url = new URL(response.route_to);
      if (url.host === 'faq.coronavirus.gov' && url.pathname === '/search/') {
        // Return the URL minus the hostname, with the orginal query included
        return `${BASE_URL}${url.pathname}${url.search}&source=${encodeURIComponent(query)}`;
      }

      // This is a routed query to something other than search results.
      return response.route_to;
    })(),
    results: response.web && response.web.results ? response.web.results.map(result => {
      return {
        url: result.url,
        title: result.title,
        description: result.snippet
      };
    }) : []
  }
};

export const doSearchGovSearch = (query, highlightSearchTerms) => new Promise((resolve, reject) => {
  const searchEndpoint = new URL(`${SEARCHGOV_ENDPOINT}/api/v2/search/i14y`);
  const searchTimeout = 3; // seconds

  window.setTimeout(() => {
    reject(new Error(`Request for search.gov results timed out after ${searchTimeout} seconds.`));
  }, searchTimeout * 1000);

  Object.entries({
    affiliate: SEARCHGOV_AFFILIATE,
    access_key: SEARCHGOV_ACCESS_KEY,
    query: query,
    limit: RESULTS_LIMIT,
    enable_highlighting: highlightSearchTerms
  }).forEach(([key, value]) => searchEndpoint.searchParams.append(key, value));

  const searchgov = fetch(searchEndpoint)
    .then(response => response.json());

  searchgov.catch(reject);

  searchgov
    .then(translateFromSearchGov(query))
    .then(resolve);
});
