require('uswds/dist/js/uswds.min');
require('./simple-jekyll-search');

(function () {
  const form = document.getElementById('search_form');
  if (form) {
    const urlParams = new URLSearchParams(window.location.search);
    const autocomplete = document.getElementById('autocomplete-container');
    const fullPageResults = document.getElementById('search-results');
    const searchBox = document.getElementById('search-box');

    const sjs = SimpleJekyllSearch({
      searchInput: searchBox,
      resultsContainer: fullPageResults || autocomplete,
      json: form.action + '.json',
      noResultsText: 'No results found.',
      searchResultTemplate: '<li class="padding-1 font-sans-md"><a href="{url}" title="{desc}">{title}</a></li>',
      templateMiddleware: function (prop, value, template) {
        if (prop === 'url') return value;

        const inputValue = searchBox.value;
        const regex = new RegExp(inputValue, 'i');

        const output = value.replace(regex, function (v) {
          return '<b>'+ v +'</b>'
        });
        return output
      },
      limit: 10
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
