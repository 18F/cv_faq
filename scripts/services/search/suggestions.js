import Fuse from 'fuse.js';

import { BASE_URL, RESULTS_LIMIT } from './constants';


const translate = (query) => (results) => {
  return {
    results: results
      .slice(0, RESULTS_LIMIT).map(result => {
        const searchTerms = result.item;
        return {
          url: `${BASE_URL}/search/?query=${encodeURIComponent(searchTerms)}`,
          title: searchTerms,
          description: searchTerms,
        };
      })
  };
};

export const suggestSearchTerms = (query) => new Promise((resolve, reject) => {
  const suggestions = fetch(`${BASE_URL}/suggestions.json`)
    .then(response => response.json());

  suggestions.catch(reject);
  suggestions
    .then(response => {
      return new Fuse(response, {
        //keys: ["title", "excerpt", "content"],
        distance: 100,
        ignoreFieldNorm: true
      }).search(query.replace(/^\s+|\s+$/g, ''));
    })
    .then(translate(query))
    .then(resolve);
});
