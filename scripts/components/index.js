import { initAccordion } from './accordion';
import { initLoadMore } from './load-more';
import { initSearchForm } from './search-form';
import { initSearchResults } from './search-results';
import { initAutoComplete } from './type-ahead';
import { initClickTracking } from './click-tracking';

const onReady = function (initFunc) {
  if (document.readyState !== 'loading') {
    initFunc();
  }
  else {
    document.addEventListener('DOMContentLoaded', function () {
      initFunc();
    }, false);
  }
};

// Initialize immediately
initAccordion();
initLoadMore();
initSearchForm();

// Initialize after DOM loaded
onReady(function () {
  initAutoComplete();
  initSearchResults();
  initClickTracking();
});
