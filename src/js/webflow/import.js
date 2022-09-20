function addStylesheet(window, path) {
    const tag = window.document.createElement("link");
    tag.setAttribute("rel", "stylesheet");
    tag.setAttribute("href", path);
    let headContent = window.document.getElementsByTagName('head')[0];
    headContent.appendChild(tag);
}

function add_js(window, path) {
    const tag = window.document.createElement("script");
    tag.setAttribute("src", path);
    let headContent = window.document.getElementsByTagName('head')[0];
    headContent.appendChild(tag);
}

function updateScriptSource(window) {
    let scripts = window.document.getElementsByTagName('script')
    for (let i = 0; i < scripts.length; ++i) {
        let src = scripts[i].getAttribute('src');
        if (src !== null && src.indexOf('https://gcro.openup.org.za') >= 0) {
            scripts[i].setAttribute('src', 'js/index.js')
        }
    }
}

function setupTranslation(window) {
    setupPointMapperTranslations(window);

    let i18nElements = window.document.getElementsByClassName('i18n')
    for (let i = 0; i < i18nElements.length; ++i) {
        let text = i18nElements[i].textContent.trim();
        i18nElements[i].setAttribute('data-i18n', text);
    }
}

function setupPointMapperTranslations(window){
    window.document.querySelector('.point-mapper .point-mapper-content .point-mapper-content__description div').classList.add('i18n');
    window.document.querySelector('.map-bottom-items--v2 p.point-filters__no-data').classList.add('i18n');
}

exports.transformDOM = function (window, $) {
    // update js src
    updateScriptSource(window);

    // Add custom css
    addStylesheet(window, "custom-css/mapchip.scss");

    // translation
    setupTranslation(window);
};
