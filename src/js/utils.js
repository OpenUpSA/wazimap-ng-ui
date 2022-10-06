import {merge} from 'lodash';
import {format as d3format} from 'd3-format';

const queryCache = {};

const SHEETNAME_CHAR_LIMIT = 31;

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
            if (req.status === 200) {
                const json = JSON.parse(req.response);
                resolve(json);
            } else if (req.status === 401 || request.status === 403) {
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
    $('.map__tooltip_value').css('white-space', 'nowrap');
    $('.leaflet-popup-content-wrapper').css('padding', 0);
    $('.leaflet-popup-content').css('margin', 'unset');
    $('.leaflet-popup-content p').css('margin', 'unset');
    $('.leaflet-container').css('font', 'unset');

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

export class Component extends Observable {
    constructor(parent = null) {
        super()

        this._parent = parent;
        this._children = [];

        if (parent != null) {
            this._parent.registerChild(this);
        }
    }

    registerChild(child) {
        this._children.push(child);
    }

    get children() {
        return this._children;
    }

    get parent() {
        return this._parent;
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

export function isNull(x) {
    return x === null;
}

export function isUndefined(x) {
    return x === undefined
}

export function isEmptyString(x) {
    return x == '';
}

export function isEmptyObject(x) {
    try {
        if (typeof x === 'object' && x !== null)
            return Object.keys(x).length == 0
        else
            return false;
    } catch (TypeError) {
        return false;
    }
}

export function isMissingData(x) {
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

export function getAPIUrl(defaultUrl) {
    return sessionStorage.getItem("wazi.apiUrl") || process.env.API_URL || defaultUrl;
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

export function checkIfCategoryHasChildren(category, detail) {
    let hasChildren = false
    for (const [subcategory, subcategoryDetail] of Object.entries(detail.subcategories)) {
        if (checkIfSubCategoryHasChildren(subcategory, subcategoryDetail))
            return true
    }

    return false
}

export function checkIfSubCategoryHasChildren(subcategory, detail) {
    let hasChildren = false;
    for (const [title, data] of Object.entries(detail.indicators)) {
        if (!hasChildren && data.data !== undefined && data.dataset_content_type !== 'qualitative' && !isIndicatorExcluded(data, 'data mapper')) {
            for (const [geo, arr] of Object.entries(data.data)) {
                hasChildren = hasChildren || arr.length > 0;
            }
        }
    }

    return hasChildren;
}

export function checkIfIndicatorHasChildren(indicator, detail) {
    let hasChildren = false;
    if (detail.data !== undefined && Object.entries(detail.data).length > 0) {
        hasChildren = true;
    }

    return hasChildren;
}

export function checkIfSubIndicatorHasChildren(subindicator, childData) {
    let hasData = false;
    for (const [geography, data] of Object.entries(childData)) {
        data.forEach((indicatorDataPoint) => {
            for (const [title, value] of Object.entries(indicatorDataPoint)) {
                if (subindicator === value) {
                    hasData = true;
                }
            }
        })
    }
    return hasData;
}

export function isIndicatorExcluded(indicatorData, excludeType) {
    let isExcluded = false;

    if (indicatorData.chartConfiguration === undefined || indicatorData.chartConfiguration.exclude === undefined) {
        isExcluded = false;
    } else {
        if (indicatorData.chartConfiguration.exclude.indexOf(excludeType) >= 0) {
            isExcluded = true;
        }
    }

    return isExcluded;
}

export function filterAndSumGeoCounts(childData, primaryGroup, selectedSubindicator) {
    let sumData = {};
    Object.entries(childData).map(([code, data]) => {
        let filteredArr = data.filter((a) => {
            return a[primaryGroup] === selectedSubindicator;
        });

        if (filteredArr.length > 0) {
            sumData[code] = filteredArr.reduce(function (s, a) {
                return s + parseFloat(a.count);
            }, 0);
        }
    })

    return sumData;
}

export function getFilterGroups(groups, primaryGroup) {
    groups = groups.reduce(function (memo, e1) {
        let matches = memo.filter(function (e2) {
            return e1.name === e2.name
        })
        if (matches.length == 0)
            memo.push(e1)
        return memo;
    }, [])

    groups = groups.filter((g) => {
        return g.name !== primaryGroup
    });

    return groups;
}

export function extractSheetsData(data) {
    let sheets = [];

    data.results.forEach((r) => {
        let sheet = extractSheetData(r, r.category);
        if (sheet.sheetData.length > 0) {
            sheets.push(sheet);
        }
    })

    return sheets;
}

export function extractSheetData(rawData, categoryName) {
    const sheetName = getSheetName(categoryName);
    let rows = rawData.features.map((f) => {
        let {geometry: {coordinates: [longitude, latitude]}, properties: {name, data}} = f;

        let mapped = data.map(item => ({[item.key]: item.value}));
        return Object.assign({name, longitude, latitude}, ...mapped);
    })

    return {
        sheetName: sheetName,
        sheetData: rows
    }
}

export function getSheetName(name) {
    const suffix = '...';
    const sheetName = name.length > SHEETNAME_CHAR_LIMIT ? name.substring(0, SHEETNAME_CHAR_LIMIT - suffix.length) + suffix : name;

    return sheetName;
}

export function appendFilterArrays(arr1, arr2, primaryGroup) {
    let filterArr = arr1.concat(arr2).filter((f) => {
        return f.group !== primaryGroup
    });

    filterArr = filterArr.filter((f, index, self) =>
            index === self.findIndex((t) => (
                t.group === f.group
            ))
    )

    return filterArr;
}

export function assertNTemplates(n, $templateSelection) {
    console.assert(
        $templateSelection.length === n,
        `Should be exactly ${n} template(s) but found ${$templateSelection.length}`
    );
}

export function trimValue(val) {
    let result = val;
    if (typeof val === 'string' || val instanceof String) {
        result = val.trim();
    }

    return result;
}

export function calculateThemeBackgroundColor(iconColor){
    const opacity = '0.2';
    let colorRgb = hexToRgb(iconColor);

    return rgba2hex(`rgb(${colorRgb.r}, ${colorRgb.g}, ${colorRgb.b}, ${opacity})`);
}

export function hexToRgb(hex) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

export function rgba2hex(orig) {
    let a,
        rgb = orig.replace(/\s/g, '').match(/^rgba?\((\d+),(\d+),(\d+),?([^,\s)]+)?/i),
        alpha = (rgb && rgb[4] || "").trim(),
        hex = rgb ?
            (rgb[1] | 1 << 8).toString(16).slice(1) +
            (rgb[2] | 1 << 8).toString(16).slice(1) +
            (rgb[3] | 1 << 8).toString(16).slice(1) : orig;

    if (alpha !== "") {
        a = alpha;
    } else {
        a = '01';
    }
    // multiply before convert to HEX
    a = ((a * 255) | 1 << 8).toString(16).slice(1)
    hex = hex + a;

    return hex;
}