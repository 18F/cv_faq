import accessibleAutocomplete from 'accessible-autocomplete';

import { debounce } from '../utils';
import { suggestSearchTerms } from '../services/search';

const AUTOCOMPLETE_CONTAINER_CLASS = 'autocomplete_container';

const highlight = (text, query) => {
  if (!query) {
    return;
  }
  let words = query.split(' ').filter(word => word.length);
  return text.replace(new RegExp('(\\b)(' + words.join('|') + ')(\\b)','ig'), '$1<strong>$2</strong>$3');
};

export const initAutoComplete = function () {
  const autocompleteContainer = document.querySelector(`.${AUTOCOMPLETE_CONTAINER_CLASS}`);
  if (!autocompleteContainer) {
    return;
  }

  const previousInput = autocompleteContainer.querySelector('input');
  autocompleteContainer.innerHTML = '';
  let runningRequest = null;

  const makeDebouncedRequest = debounce((query, completed) => {
    suggestSearchTerms(query)
      .then(response => completed(response.results.slice(0, 5)));
  }, 300);

  const searchParams = new URLSearchParams(window.location.search);
  const query = (
    searchParams.get('source') ||
    searchParams.get('query') ||
    undefined
   );

  accessibleAutocomplete({
    element: autocompleteContainer,
    id: 'search-box',
    name: 'query',
    placeholder: previousInput.getAttribute('placeholder'),
    confirmOnBlur: false,
    defaultValue: query,
    onConfirm: (item) => {
      if (item && item.url) {
        window.location.href = item.url;
      }
    },
    tNoResults: () => {
      return runningRequest ? 'Loading…' : `No results for “${newInput.value}”`;
    },
    source: (query, populateResults) => {
      const thisRequest = makeDebouncedRequest(query, (results) => {
        // Do not update results if another request has started since.
        if (runningRequest === thisRequest) {
          runningRequest = null;
          const highlightedResults = results.map(item => {
            return highlight(item.title, query)
          });
          populateResults(highlightedResults);
        }
      });
      runningRequest = thisRequest;
    }
  });

  const newInput = autocompleteContainer.querySelector('input');

  // Still perform search if pressing enter when the dropdown is open but no item selected.
  newInput.addEventListener('keydown', (evt) => {
    if (evt.keyCode === 13) { // enter
      evt.currentTarget.form.submit();
    }
  });
};
