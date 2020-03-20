//= require uswds/dist/js/uswds.min
//= require ./search


//////////////////////////////////
// Accordions

(() => {
  const NAMESPACE = '#main-content';
  const BUTTON = '.usa-accordion__button';
  const EXPANDED = 'aria-expanded';

  const accordionButtons = document.querySelectorAll(`${NAMESPACE} ${BUTTON}`);
  const target = document.querySelector(`${NAMESPACE} ${BUTTON}${window.location.hash}`);

  if (accordionButtons.length) {
    accordionButtons.forEach(a => a.setAttribute(EXPANDED, false));
    (target || accordionButtons[0]).setAttribute(EXPANDED, true);
  }
})();
