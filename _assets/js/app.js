//= require uswds/dist/js/uswds.min

const EXPANDED = "aria-expanded";

var url = window.location.href;
var idx = url.indexOf("#");
var questionAnchor = idx != -1 ? url.substring(idx + 1) : "";

if (questionAnchor.length > 1) {
  var accordionButtons = document.querySelectorAll('.usa-accordion__button');

  accordionButtons.forEach(accordion => {
    if (accordion.getAttribute('id') != questionAnchor) {
      accordion.setAttribute(EXPANDED, "false");
    }
  })
}
