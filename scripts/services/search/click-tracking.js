/**
 * search.gov click-tracking
 * https://docs.google.com/document/d/1ZrRczcb-tIiklxd92vJpGiZKeRCe1ll71_zXhlp8Dj0/
 */

import {
  SEARCHGOV_ACCESS_KEY,
  SEARCHGOV_AFFILIATE,
  SEARCHGOV_MODULE,
  CLICK_TRACK_URL } from './constants';

export const trackClick = ({url, query, position, next}) => {
  const clickEndpoint = new URL(CLICK_TRACK_URL);

  const formData = {
    url,
    query,
    affiliate: SEARCHGOV_AFFILIATE,
    position,
    module_code: SEARCHGOV_MODULE,
    access_key: SEARCHGOV_ACCESS_KEY,
    referrer: window.location.href,
  };

  // Construct a query string for this request
  Object.entries(formData).forEach(([key, value]) => clickEndpoint.searchParams.append(key, value));

  // Do pingback
  return fetch(clickEndpoint.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: '',
  });
};
