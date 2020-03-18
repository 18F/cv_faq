//= require uswds/dist/js/uswds.min
//= require ./search


//////////////////////////////////
// Type Ahead Input
(function () {
  window.addEventListener('DOMContentLoaded', () => {
    const renderResults = (results, elementId = 'autocomplete-results') => {
      const element = document.getElementById(elementId);

      if (!results.length) {
        element.innerHTML = renderResults_noResults();
      }
      else {
        element.innerHTML = `
          <ol>
            ${results.map(renderResults_result).join('')}
          </ol>
        `;
      }
    };

    const renderResults_noResults = () => {
      return '';
    };

    const renderResults_result = (result) => {
      return `
        <li>
          <a href="${result.url}">
            <p class="title">${highlight(result.title)}</p>
          </a>
        </li>
      `;
    };

    const highlight = (text) => {
      return text.replace(/\uE000/g, '<strong>').replace(/\uE001/g, '</strong>');
    };

    const typeAheadInput = document.getElementById('search-box');
    const typeAheadSearch = query => window.TypeAheadSearch(query)
      .then(renderResults);
    const typeAheadDebounce = window.Debounce(typeAheadSearch);

    if (typeAheadInput) {
      typeAheadInput.addEventListener('input', e => typeAheadDebounce(e.target.value));
    }
  });
})();


//////////////////////////////////
// Accordions
const EXPANDED = "aria-expanded";

var url = window.location.href;
var idx = url.indexOf("#");
var questionAnchor = idx != -1 ? url.substring(idx + 1) : "";

if (questionAnchor.length > 1) {
  var accordionButtons = document.querySelectorAll('.usa-accordion__button');

  accordionButtons.forEach(accordion => {
    if (accordion.getAttribute('id') != questionAnchor) {
      accordion.setAttribute(EXPANDED, "false");
    }
  })
}
