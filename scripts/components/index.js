import { initAccordion } from './accordion';
import { initLoadMore } from './load-more';
import { initSearchResults } from './search-results';
import { initAutoComplete } from './type-ahead';


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

// Initialize after
onReady(function () {
  initAutoComplete();
  initSearchResults();
});
