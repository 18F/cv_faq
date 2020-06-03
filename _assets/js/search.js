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
  };

  //////////////////////////////////
  // Translation

  const translate_fromSearchGov = (query) => (response) => {
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
        if (url.host == 'faq.coronavirus.gov' && url.pathname == '/search/') {
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

  const translate_fromSearchJson = (response) => {
    const smartTruncate = (text, targetLength) => {
      if (text.length < targetLength) {
        return text;
      }

      const regex = new RegExp(`^.{${targetLength}}[^ ]*`);
      return regex.exec(text)[0];
    };

    return {
      results: response.slice(0, RESULTS_LIMIT).map(result => {
        return {
          url: result.item.url,
          title: result.item.title,
          description: smartTruncate(result.item.content, 300),
        };
      })
    };
  }

  //////////////////////////////////
  // Performing search

  const search_searchGov = (query, highlightSearchTerms) => new Promise((resolve, reject) => {
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
      .then(translate_fromSearchGov(query))
      .then(resolve);
  });

  const search_local = (query) => new Promise((resolve, reject) => {
    const searchjson = fetch(`${BASE_URL}/search.json`)
      .then(response => response.json());

    searchjson.catch(reject);

    searchjson
      .then(pages => {
        return new Fuse(pages, {
          keys: ["title", "excerpt", "content"],
          distance: 1000
        }).search(query);
      })
      .then(translate_fromSearchJson)
      .then(resolve);
  });

  window.SearchService = (query, highlightSearchTerms) => new Promise((resolve, reject) => {
    search_searchGov(query, highlightSearchTerms)
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

  const highlight = (text, query) => {
    if (!query) {
      return;
    }
    let words = query.split(' ').filter(word => word.length);
    return text.replace(new RegExp('(\\b)(' + words.join('|') + ')(\\b)','ig'), '$1<strong>$2</strong>$3');
  };

  window.initializeAutocomplete = function (autocompleteContainer, defaultValue) {
    const previousInput = autocompleteContainer.querySelector('input');
    autocompleteContainer.innerHTML = '';
    let runningRequest = null;
    let currentQuery = null;

    const makeDebouncedRequest = debounce((query, completed) => {
      search_local(query)
        .then(response => completed(response.results.slice(0, 5)));
    }, 300);

    accessibleAutocomplete({
      element: autocompleteContainer,
      id: 'search-box',
      name: 'query',
      defaultValue: defaultValue,
      placeholder: previousInput.getAttribute('placeholder'),
      confirmOnBlur: false,
      onConfirm: (item) => {
        if (item && item.url) {
          window.location.href = item.url;
        }
      },
      templates: {
        inputValue: () => '',
        suggestion: (item) => highlight(item.title, currentQuery)
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
        currentQuery = query;
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
})();
