exports.transform = function (window, $) {
  const tag = window.document.createElement("script");
  tag.setAttribute("src", "js/index.js");
  window.document.body.appendChild(tag);
}
