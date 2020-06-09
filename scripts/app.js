import 'uswds';

import { initAccordion, initLoadMore } from './accordion';
import { initAutoComplete, initSearch } from './search';


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

onReady(function () {
  initAccordion();
  initAutoComplete();
  initLoadMore();
  initSearch();
});
