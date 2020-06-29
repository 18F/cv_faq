import {
  BASE_URL, RESULTS_LIMIT, SEARCHGOV_ACCESS_KEY, SEARCHGOV_AFFILIATE,
  SEARCHGOV_ENDPOINT
} from './constants';


// All routed queries on our search.gov endpoint map to the production domain
const ROUTED_QUERY_DOMAIN_NAME = 'faq.coronavirus.gov';
const SEARCH_PATH = '/search/';


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
      if (url.host === ROUTED_QUERY_DOMAIN_NAME && url.pathname === SEARCH_PATH) {
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
    }) : [],
    resultsCount: response.web ? response.web.total : null,
    nextOffset: response.web ? response.web.next_offset : null,
    total: response.total
  }
};

export const doSearchGovSearch = ({
  query,
  offset,
  highlightSearchTerms,
  searchTimeoutSeconds
}) => new Promise((resolve, reject) => {
  const searchEndpoint = new URL(`${SEARCHGOV_ENDPOINT}/api/v2/search/i14y`);

  if (searchTimeoutSeconds) {
    window.setTimeout(() => {
      reject(new Error(`Request for search.gov results timed out after ${searchTimeoutSeconds} seconds.`));
    }, searchTimeoutSeconds * 1000);
  }

  Object.entries({
    affiliate: SEARCHGOV_AFFILIATE,
    access_key: SEARCHGOV_ACCESS_KEY,
    query: query,
    limit: offset ? RESULTS_LIMIT : RESULTS_LIMIT + 1,
    enable_highlighting: highlightSearchTerms,
    offset: offset || 0
  }).forEach(([key, value]) => searchEndpoint.searchParams.append(key, value));

  const searchgov = fetch(searchEndpoint)
    .then(response => response.json());

  searchgov.catch(reject);

  searchgov
    .then(translateFromSearchGov(query))
    .then(resolve);
});
