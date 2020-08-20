import Fuse from 'fuse.js';

import { BASE_URL, RESULTS_LIMIT } from './constants';


const smartTruncate = (text, targetLength) => {
  if (text.length < targetLength) {
    return text;
  }

  const regex = new RegExp(`^.{${targetLength}}[^ ]*`);
  return regex.exec(text)[0];
};

const translateFromSearchJson = (response) => {
  return {
    total: response.length,
    resultsCount: response.length,
    //nextOffset: response.web ? response.web.next_offset : null,
    results: response.slice(0, RESULTS_LIMIT).map(result => {
      return {
        url: result.item.url,
        title: result.item.title,
        description: smartTruncate(result.item.content, 300),
      };
    })
  };
};

export const doLocalSearch = (query) => new Promise((resolve, reject) => {
  const searchjson = fetch(`${BASE_URL}/search.json`)
    .then(response => response.json());

  searchjson.catch(reject);

  searchjson
    .then(pages => {
      const fuse = new Fuse(pages, {
        keys: ["title", "excerpt", "content"],
        distance: 1000
      }).search(query);
      console.log(fuse);
      return fuse;
    })
    .then(translateFromSearchJson)
    .then(resolve);
});
