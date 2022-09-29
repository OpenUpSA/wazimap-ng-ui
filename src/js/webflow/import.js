function add_stylesheet(window, path) {
  const tag = window.document.createElement("link");
  tag.setAttribute("rel", "stylesheet");
  tag.setAttribute("href", path);
  var headContent = window.document.getElementsByTagName('head')[0];
  headContent.appendChild(tag);
}

function add_js(window, path) {
  const tag = window.document.createElement("script");
  tag.setAttribute("src", path);
  var headContent = window.document.getElementsByTagName('head')[0];
  headContent.appendChild(tag);
}

exports.transformDOM = function(window, $) {
  // Add custom css
  add_stylesheet(window, "custom-css/mapchip.scss")

  $('script[src="https://gcro.openup.org.za/js.117393d3.js"]').remove();

  const tag = window.document.createElement("script");
  tag.setAttribute("src", "js/index.js");
  tag.setAttribute("type", "module");
  window.document.body.appendChild(tag);
};
