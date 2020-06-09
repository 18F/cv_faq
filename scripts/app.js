import 'uswds';

import { initComponents } from './components';


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

onReady(initComponents);
