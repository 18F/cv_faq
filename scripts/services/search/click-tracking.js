/**
 * search.gov click-tracking
 * https://docs.google.com/document/d/1ZrRczcb-tIiklxd92vJpGiZKeRCe1ll71_zXhlp8Dj0/
 */

import { SEARCHGOV_ACCESS_KEY, SEARCHGOV_AFFILIATE } from './constants';

const CLICK_TRACK_URL = 'https://api.gsa.gov/technology/searchgov/v2/clicks/';

export const trackClick = ({url, query, position}) => {
  const clickEndpoint = new URL(CLICK_TRACK_URL);

  // Construct a query string for this request
  Object.entries({
    url,
    query,
    affiliate: SEARCHGOV_AFFILIATE,
    position,
    module_code: 'i14y',
    access_key: SEARCHGOV_ACCESS_KEY,
    client_ip: '0.0.0.0',
    user_agent: navigator.userAgent,
    referrer: window.location.href,
  }).forEach(([key, value]) => clickEndpoint.searchParams.append(key, value));

  // Do pingback - no need to wait for response
  fetch(clickEndpoint);
};
