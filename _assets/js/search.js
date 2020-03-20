//= require fuse.js/dist/fuse
//= require accessible-autocomplete/dist/accessible-autocomplete.min

(() => {
  const RESULTS_LIMIT = 50;
  const BASE_URL = document.querySelector("meta[name='baseurl']").content;
  const SEARCHGOV_ENDPOINT = document.querySelector("meta[name='searchgov_endpoint']").content;
  const SEARCHGOV_AFFILIATE = document.querySelector("meta[name='searchgov_affiliate']").content;
  const SEARCHGOV_ACCESS_KEY = document.querySelector("meta[name='searchgov_access_key']").content;

  //////////////////////////////////
  // Utils
  const debounce = (func, timeout) => {
    let timer;

    return (...args) => {
      const next = () => func(...args);
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(next, timeout > 0 ? timeout : 300);
      return timer;
    };
  }

  //////////////////////////////////
  // Translation

  const translate_fromSearchGov = (response) => {
    return response.web.results.map(result => {
      return {
        url: result.url,
        title: result.title,
        description: result.snippet
      };
    });
  };

  const translate_fromSearchJson = (response) => {
    const smartTruncate = (text, targetLength) => {
      if (text.length < targetLength) {
        return text;
      }

      const regex = new RegExp(`^.{${targetLength}}[^ ]*`);
      return regex.exec(text)[0];
    };

    return response.slice(0, RESULTS_LIMIT).map(result => {
      return {
        url: result.item.url,
        title: result.item.title,
        description: smartTruncate(result.item.content, 300),
      };
    });
  }

  //////////////////////////////////
  // Performing search

  const search_searchGov = (query) => new Promise((resolve, reject) => {
    const searchEndpoint = new URL(`${SEARCHGOV_ENDPOINT}/api/v2/search/i14y`);
    const searchTimeout = 3; // seconds

    window.setTimeout(() => {
      reject(new Error(`Request for search.gov results timed out after ${searchTimeout} seconds.`));
    }, searchTimeout * 1000);

    Object.entries({
      affiliate: SEARCHGOV_AFFILIATE,
      access_key: SEARCHGOV_ACCESS_KEY,
      query: query,
      limit: RESULTS_LIMIT
    }).forEach(([key, value]) => searchEndpoint.searchParams.append(key, value));

    const searchgov = fetch(searchEndpoint)
      .then(response => response.json());

    searchgov.catch(reject);

    searchgov
      .then(translate_fromSearchGov)
      .then(resolve);
  });

  const search_local = (query) => new Promise((resolve, reject) => {
    const searchjson = fetch(`${BASE_URL}/search.json`)
      .then(response => response.json());

    searchjson.catch(reject);

    searchjson
      .then(pages => {
        return new Fuse(pages, {
          keys: ["title", "excerpt", "content"]
        }).search(query);
      })
      .then(translate_fromSearchJson)
      .then(resolve);
  });

  window.SearchService = (query) => new Promise((resolve, reject) => {
    search_searchGov(query)
      .then(resolve)
      .catch(error => {
        console.warn('Using local search fallback.', error);
        search_local(query)
          .then(resolve)
          .catch(reject);
      });
  });

  //////////////////////////////////
  // Type Ahead Input

  const autocompleteContainer = document.querySelector('.autocomplete_container');

  const highlight = (text) => {
    return text.replace(/\uE000/g, '<strong>').replace(/\uE001/g, '</strong>');
  };

  if (autocompleteContainer) {
    const previousInput = autocompleteContainer.querySelector('input');
    autocompleteContainer.innerHTML = '';
    let runningRequest = null;

    const makeDebouncedRequest = debounce((query, completed) => {
      window.SearchService(query)
        .then(results => completed(results.slice(0, 5)));
    }, 300);

    accessibleAutocomplete({
      element: autocompleteContainer,
      id: 'search-box',
      name: 'query',
      placeholder: previousInput.getAttribute('placeholder'),
      confirmOnBlur: false,
      onConfirm: (item) => {
        if (item && item.url) {
          window.location.href = item.url;
        }
      },
      templates: {
        inputValue: () => '',
        suggestion: (item) => highlight(item.title)
      },
      tNoResults: () => {
        return runningRequest ? 'Loading…' : `No results for “${newInput.value}”`;
      },
      source: (query, populateResults) => {
        const thisRequest = makeDebouncedRequest(query, (results) => {
          // Do not update results if another request has started since.
          if (runningRequest === thisRequest) {
            runningRequest = null;
            populateResults(results);
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
  }
})();
