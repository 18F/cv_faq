import { trackClick } from '../services/search';

export const initClickTracking = function () {
  const query = new URLSearchParams(window.location.search);
  if (query.has('ctquery')) {
    const url = window.location.href.replace(window.location.search, '');
    window.history.replaceState(null, '', window.location.pathname);

    return trackClick({
      url: url,
      query: query.get('ctquery'),
      position: query.get('ctposition'),
    });
  }
}
