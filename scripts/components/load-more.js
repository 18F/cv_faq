
const LOAD_QUESTIONS_CLASS = 'load-questions-wrapper'
const LOAD_QUESTIONS_ATTRIBUTE = 'load-questions'

export const initLoadMore = function () {
  var wrapper = document.querySelector(`.${LOAD_QUESTIONS_CLASS}`)
  if (wrapper) {
    var button = document.querySelector(`[${LOAD_QUESTIONS_ATTRIBUTE}]`);
    var content = document.querySelector('#' + button.getAttribute('aria-controls'));

    if (content) {
      content.classList.add('display-none');
      wrapper.classList.remove('display-none');

      document.addEventListener('click', function (event) {
        if (!event.target.hasAttribute(LOAD_QUESTIONS_ATTRIBUTE)) return;
        var content = document.querySelector('#' + event.target.getAttribute('aria-controls'));

        event.target.setAttribute('aria-expanded', true);
        content.classList.remove('display-none');
        content.focus();
        wrapper.classList.add('display-none');
      });
    }
  }
};
