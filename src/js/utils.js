import {merge} from 'lodash';
import {format as d3format} from 'd3-format';

const queryCache = {};

export class Cache {
    constructor() {
        this.memoryCache = {}

    }

    getItem(key) {
        const val = localStorage.getItem(key);
        if (val != null)
            return JSON.parse(val);

        if (this.memoryCache[key] != undefined)
            return this.memoryCache[key]

        return null;
    }

    setItem(key, val) {
        try {
            localStorage.setItem(key, JSON.stringify(val));
        } catch (err) {
            console.log(`Error using localstorage, reverting to memory cache: ${err}`)
            this.memoryCache[key] = val;
        }
    }
}

const cache = new Cache();

export function getJSON(url, skipCache = true) {

    return new Promise((resolve, reject) => {
        const req = new XMLHttpRequest();
        req.open('GET', url);

        req.onload = () => {
            if (req.status == 200) {
                const json = JSON.parse(req.response);
                resolve(json);
            } else if (req.status == 401 || request.status == 403) {
                alert("Not logged in")
            } else {
                reject(Error(req.statusText));
            }
        };

        // Handle network errors
        req.onerror = () => {
            reject(Error("Network Error"));
        };

        req.send();
    });
}

export function setPopupStyle(clsName) {
    $('.leaflet-popup-close-button').html($('.facility-tooltip__close').html());
    $('.leaflet-popup-close-button').css('padding', 0);
    $('.facility-tooltip__close').css('display', 'none');
    $('.leaflet-popup-content-wrapper').css('border-radius', $('.' + clsName).css('border-radius'));
    $('.leaflet-popup-content-wrapper').css('font-family', $('.' + clsName).css('font-family'));
    $('.leaflet-popup-content-wrapper').css('font-size', $('.' + clsName).css('font-size'));
    $('.leaflet-popup-content').css('margin', $('.' + clsName).css('padding'));
    $('.leaflet-popup-content').css('min-width', $('.' + clsName).css('min-width'));
    $('.leaflet-popup-content').css('display', 'inline-table');
    $('.map__tooltip_value').css('white-space', 'nowrap');

    let popupWidth = 0;
    let chipWidth = 0;
    $('.leaflet-popup-content-wrapper').each(function () {
        //when user hovers over a geo and then another geo, for a moment there are 2 .leaflet-popup-content-wrapper elements
        //get the one with no style tag
        //find a better solution
        if (typeof $(this).find('.map-tooltip__geography-chip').attr('style') === 'undefined') {
            popupWidth = this.clientWidth;
            if (typeof $(this).find('.map-tooltip__geography-chip')[0] !== 'undefined') {
                chipWidth = $(this).find('.map-tooltip__geography-chip')[0].clientWidth;
            }
        }
    });

    let leftOffset = (popupWidth - chipWidth) / 2;
    $('.map-tooltip__geography-chip').css('left', leftOffset);
}

export class ThemeStyle {
    static replaceChildDivWithThemeIcon(themeId, colorElement, iconElement) {
        let iconClass = '.';
        switch (themeId) {
            case 1: //Health theme
                iconClass += 'icon--health';
                break;
            case 2: //Education theme
                iconClass += 'icon--education';
                break;
            case 3: //Labour theme
                iconClass += 'icon--elections';
                break;
            case 4: //Transport theme
                iconClass += 'icon--transport';
                break;
            case 5: //Social theme
                iconClass += 'icon--people';
                break;
            default:
                return false;
        }

        //clear icon element and add icon
        $(iconElement).empty().append($('.styles').find(iconClass).prop('outerHTML'));
        //remove classes
        $(colorElement).removeClass('_1 _2 _3 _4 _5');
        //Add correct color to element which requires it
        $(colorElement).addClass('_' + themeId);

        return true;
    }

    static replaceChildDivWithIcon(element, icon) {
        $(element).empty().append('<i class="material-icons">' + icon + '</i>');
    }
}

export class Observable {
    constructor() {
        this.eventListeners = {}
    }

    on(event, func) {
        if (this.eventListeners[event] == undefined)
            this.eventListeners[event] = [];
        this.eventListeners[event].push(func);
    };

    triggerEvent(event, payload) {
        if (this.eventListeners[event] != undefined) {
            this.eventListeners[event].forEach(listener => {
                listener(payload);
            });
        }
    };

    bubbleEvent(obj, event) {
        obj.on(event, payload => {
            this.triggerEvent(event, payload);
        })

    }

    bubbleEvents(obj, events) {
        events.forEach(event => {
            this.bubbleEvent(obj, event);
        })
    }
}

export const numFmt = d3format(",.2f");
export const numFmtAlt = d3format("~s");
// export const percFmt = x => (x * 100).toFixed(2);
export const percFmt = d3format(".1%")

export function hasElements(arr) {
    if (arr != null && arr != undefined && arr.length > 0)
        return true
    return false;
}

export function checkIterate(arr, func) {
    if (!hasElements(arr))
        return

    arr.forEach((el, i) => {
        func(el, i);
    })
}

export function formatNumericalValue(number, formatting, method) {
    let fn = d3format(formatting.percentage);
    if (method === 'absolute_value') {
        fn = d3format(formatting.integer);
    } else if (method === 'decimal') {
        fn = d3format(formatting.decimal);
    }

    return fn(number);
}

function isNull(x) {
    return x === null;
}

function isUndefined(x) {
    return x === undefined
}

function isEmptyString(x) {
    return x == '';
}

function isEmptyObject(x) {
    try {
        if (typeof x === 'object' && x !== null)
            return Object.keys(x).length == 0
        else
            return false;
    } catch (TypeError) {
        return false;
    }
}

function isMissingData(x) {
    const funcs = [isNull, isUndefined, isEmptyString, isEmptyObject]
    const res = funcs.filter(f => f(x))

    return res.length > 0;
}

export function defaultIfMissing(x, defaultVal) {
    if (isMissingData(x))
        return defaultVal;
    return x;
}

export const validation = {
    isNull, isUndefined, isEmptyString, isEmptyObject, isMissingData
}


export function getHostname() {
    let hostname = process.env.HOSTNAME || window.location.hostname;
    const isNetlifyStaging = (hostname.indexOf('wazimap-staging.netlify.app') >= 0)
    const isNetlifyProduction = (hostname.indexOf('wazimap-production.netlify.app') >= 0)

    if (isNetlifyStaging)
        hostname = "wazimap-ng.africa"
    else if (isNetlifyProduction)
        hostname = "beta.youthexplorer.org.za"

    hostname = sessionStorage.getItem("wazi-hostname") || hostname;
    return hostname;
}

export function loadDevTools(callback) {
    const explicitlyDisabled =
        window.location.search.includes('dev-tools=false') ||
        window.localStorage.getItem('dev-tools') === 'false'

    const explicitlyEnabled =
        window.location.search.includes('dev-tools=true') ||
        window.localStorage.getItem('dev-tools') === 'true'

    if (
        !explicitlyDisabled &&
        (process.env.NODE_ENV === 'development' || explicitlyEnabled)
    ) {
        // use a dynamic import so the dev-tools code isn't bundled with the regular
        // app code so we don't worry about bundle size.
        import('./dev-tools')
            .then(devTools => devTools.install())
            .finally(callback)
    } else {
        // if we don't need the DevTools, call the callback immediately.
        callback()
    }
}

export function saveAs(uri, filename) {
    let link = document.createElement('a');
    if (typeof link.download === 'string') {

        link.href = uri;
        link.download = filename;

        //Firefox requires the link to be in the body
        document.body.appendChild(link);

        //simulate click
        link.click();

        //remove the link when done
        document.body.removeChild(link);

    } else {
        window.open(uri);
    }
}

export function fillMissingKeys(obj, defaultObj, deep_copy = false) {
    return merge({}, defaultObj, obj)
}
