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

  const pageHashButtons = document.querySelectorAll(`${BUTTON}[set-page-hash]`);
  pageHashButtons.forEach(button => button.addEventListener('click', (event) => {
    //document.location = '#' + event.target.id;
    document.location.replace('#' + event.target.id);
  }));
})();

//////////////////////////////////
// Load more questions
var wrapper = document.querySelector('.load-questions-wrapper')
if (wrapper) {
  var button = document.querySelector('[load-questions]');
  var content = document.querySelector('#' + button.getAttribute('aria-controls'));

  if (content) {
    content.classList.add('display-none');
    wrapper.classList.remove('display-none');

    document.addEventListener('click', function (event) {
      if (!event.target.hasAttribute('load-questions')) return;
      var content = document.querySelector('#' + event.target.getAttribute('aria-controls'));

      event.target.setAttribute('aria-expanded', true);
      content.classList.remove('display-none');
      content.focus();
      wrapper.classList.add('display-none');
    });
  }
}
