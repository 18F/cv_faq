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

const EXPANDED = "aria-expanded";

var url = window.location.href;
var idx = url.indexOf("#");
var questionAnchor = idx != -1 ? url.substring(idx+1) : "";

if(questionAnchor.length > 1){
  console.log(questionAnchor)
  var accordianButtons = document.querySelectorAll('.usa-accordion__button');

  accordianButtons.forEach(accordion =>{
    if(accordion.getAttribute('id') != questionAnchor) {
      accordion.setAttribute(EXPANDED, "false");
      console.log(accordion.getAttribute('id') + 'closed');
    }
  })
}


