require('uswds/dist/js/uswds.min');
require('./simple-jekyll-search');

(function () {
  const form = document.getElementById('search_form');
  if (form) {
    const urlParams = new URLSearchParams(window.location.search);
    const autocomplete = document.getElementById('autocomplete-container');
    const fullPageResults = document.getElementById('search-results');

    const sjs = SimpleJekyllSearch({
      searchInput: document.getElementById('search-box'),
      resultsContainer: fullPageResults || autocomplete,
      json: form.action + '.json'
    });

    const query = urlParams.get('query');

    if (query) {
      window.addEventListener('load', function () {
        const searchInput = document.querySelector('#search-box');
        searchInput.setAttribute("value", query);
        sjs.search(query);
      });
    }
  }
})();
