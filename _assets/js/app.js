//= require simple-jekyll-search/dest/simple-jekyll-search.js

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
      window.sjs = sjs;
      sjs.search(query);
    }
  }
})();
