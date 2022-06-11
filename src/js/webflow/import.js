exports.transformDOM = function(window, $) {
  $("title").text("{{ title }}");
  $('meta[property="og:title"]').attr("content", "{{ title }}");
  $('meta[property="twitter:title"]').attr("content", "{{ title }}");

  $('script[src="https://gcro.openup.org.za/js.117393d3.js"]').remove();

  const tag = window.document.createElement("script");
  tag.setAttribute("src", "js/index.js");
  window.document.body.appendChild(tag);
};
