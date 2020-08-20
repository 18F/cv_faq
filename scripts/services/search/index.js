import { doLocalSearch } from './local';
import { doSearchGovSearch } from './search-gov';
import { suggestSearchTerms } from './suggestions';


export const SearchService = ({
  query,
  offset,
  highlightSearchTerms,
  localFallback
}) => new Promise((resolve, reject) => {
  const searchGov = doSearchGovSearch({
    query,
    offset,
    highlightSearchTerms,
    searchTimeoutSeconds: localFallback ? 3 : null
  }).then(resolve);

  if (localFallback) {
    searchGov.catch(error => {
      console.warn('Using local search fallback.', error);
      doLocalSearch(query)
        .then(resolve)
        .catch(reject);
      });
  }
  else {
    searchGov.catch(reject);
  }
});

export const LocalSearchService = ({
  query,
  offset,
  highlightSearchTerms
}) => new Promise((resolve, reject) => {
  doLocalSearch(query)
    .then(resolve)
    .catch(reject);
});

export { doSearchGovSearch, doLocalSearch, suggestSearchTerms };
