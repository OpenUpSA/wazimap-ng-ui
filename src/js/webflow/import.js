exports.transformDOM = function(window, $) {
  $("title").text("{{ title }}");
  $('meta[property="og:title"]').attr("content", "{{ title }}");
  $('meta[property="twitter:title"]').attr("content", "{{ title }}");

  const tag = window.document.createElement("script");
  tag.setAttribute("src", "js/index.js");
  window.document.body.appendChild(tag);
};
