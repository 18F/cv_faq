import { initAccordion } from './accordion';
import { initLoadMore } from './load-more';
import { initSearchResults } from './search-results';
import { initAutoComplete } from './type-ahead';


export const initComponents = function () {
  initAccordion();
  initAutoComplete();
  initLoadMore();
  initSearchResults();
};
