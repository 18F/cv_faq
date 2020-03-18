//= require uswds/dist/js/uswds.min
//= require ./search

//////////////// Utils
const debounce = (func, timeout) => {
  let timer;

  return (...args) => {
      const next = () => func(...args);
      if (timer) {
          clearTimeout(timer);
      }
      timer = setTimeout(next, timeout > 0 ? timeout : 300);
  };
}

const getSearchMeta = () => {
  const tags = {};
  const metas = document.getElementsByTagName('meta');

  for (let i = 0; i < metas.length; i++) {
    const name = metas[i].getAttribute('name');
    const content = metas[i].getAttribute('content');

    if (name && name.includes("searchgov")) {
      tags[name.split(":")[1]] = content;
    }
  }

  return tags;
}

//////////////// Rendering
const renderResults = (results, elementId = 'search-results') => {
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
  return `<h4 class="title">No results found</h4>`;
};

const renderResults_result = (result) => {
  return `
    <li>
      <a href="${result.url}">
        <h2 class="title">${highlight(result.title)}</h2>
        <p>${highlight(result.description)}... <span class="read-more">Continue reading</span></p>
      </a>
    </li>
  `;
};

const highlight = (text) => {
  return text.replace(/\uE000/g, '<span class="bg-yellow">').replace(/\uE001/g, '</span>');
};

//////////////// Translation
const translate_fromSearchGov = (response) => {
  return response.web.results.map(result => {
    return {
      url: result.url,
      title: result.title,
      description: result.snippet
    };
  });
};

////////////////// Type Ahead
const searchMeta = getSearchMeta();

const fetchRequest = query => {
  if (!query || query.length < 3) {
    return Promise.resolve({});
  }

  const searchgovEndpoint = new URL(`${searchMeta.endpoint}/api/v2/search/i14y`);

  Object.entries({
    affiliate: searchMeta.affiliate,
    access_key: searchMeta.access_key,
    query: query,
    limit: 4
  }).forEach(([key, value]) => searchgovEndpoint.searchParams.append(key, value));

  return fetch(searchgovEndpoint)
    .then(res => res.json())
    .then(translate_fromSearchGov)
}

const typeAheadSearch = query => fetchRequest(query)
  .then(results => renderResults(results, 'autocomplete-results'));

const throttledFetch = debounce(typeAheadSearch);
const typeAheadInput = document.getElementById('search-box');

typeAheadInput.addEventListener('input', e => throttledFetch(e.target.value));



////////////////// Accordions
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
