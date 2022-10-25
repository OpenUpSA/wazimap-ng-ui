function addStylesheet(window, path) {
    const tag = window.document.createElement("link");
    tag.setAttribute("rel", "stylesheet");
    tag.setAttribute("href", path);
    let headContent = window.document.getElementsByTagName('head')[0];
    headContent.appendChild(tag);
}

function setupTranslation(window) {
    setupPointMapperTranslations(window);
    setupLocationSearchTranslations(window);
    addTranslationDataVariableForText(window);
    addTranslationDataVariableForPlaceholder(window);
}

function addTranslationDataVariableForText(window) {
  let i18nElements = window.document.getElementsByClassName('i18n');
  for (let i = 0; i < i18nElements.length; ++i) {
      let text = i18nElements[i].textContent.trim();
      i18nElements[i].setAttribute('data-i18n', text);
  }
}

function addTranslationDataVariableForPlaceholder(window) {
  let i18nElements = window.document.getElementsByClassName('i18n-placeholder');
  for (let i = 0; i < i18nElements.length; ++i) {
      let placeholderText = i18nElements[i].getAttribute("placeholder").trim();
      i18nElements[i].setAttribute('data-i18n', placeholderText);
  }
}

function setupPointMapperTranslations(window) {
    let selectors = [
        '.point-mapper .point-mapper-content .point-mapper-content__description div',
        '.map-bottom-items--v2 p.point-filters__no-data',
        '.rich-data-content .location__facilities .no-data__text div',
        '.facility-info .facility-info__google-map-text',
        '.point-mapper-content__no-data .no-data__text div'
    ];

    selectors.forEach((selector) => {
        let element = window.document.querySelector(selector);
        if (element === null) {
            throw `Cannot find element : ${selector}`
        }

        element.classList.add('i18n');
    })
}

function setupLocationSearchTranslations(window) {
    let selectors = [
        'form .location__search_input',
    ];

    selectors.forEach((selector) => {
        let element = window.document.querySelector(selector);
        if (element === null) {
            throw `Cannot find element : ${selector}`
        }
        element.classList.add('i18n-placeholder');
    })
}

exports.transformDOM = function(window, $) {
    // Add custom css
    addStylesheet(window, "custom-css/mapchip.scss");
    addStylesheet(window, "custom-css/popup.scss");

    $('script[src="https://gcro.openup.org.za/js.117393d3.js"]').remove();

    const tag = window.document.createElement("script");
    tag.setAttribute("src", "js/index.js");
    window.document.body.appendChild(tag);

    // translation
    setupTranslation(window);
};
