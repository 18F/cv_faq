
export const initLoadMore = function () {
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
};
