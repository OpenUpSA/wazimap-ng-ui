import {defaultValues} from './defaultValues';
import {fillMissingKeys} from './utils';

export class Geography {
    constructor(js) {
        this._level = js.level;
        this._code = js.code;
        this._name = js.name;
    }

    get level() {
        return this._level;
    }

    get code() {
        return this._code;
    }

    get name() {
        return this._name;
    }
}

export class IndicatorHelper {
    static getMetadata(indicator) {
        return indicator.metadata || {
            source: '',
            description: '',
            url: '',
            licence: {
                name: '',
                url: ''
            }
        }
    }

    static getChartConfiguration(chart_configuration) {
        return fillMissingKeys(chart_configuration, defaultValues.chartConfiguration || {})
    }

    static fixIndicator(indicator) {
        indicator.metadata = this.getMetadata(indicator)
        indicator.chartConfiguration = this.getChartConfiguration(indicator.chart_configuration)
        return indicator
    }
}

export class Profile {

    constructor(js) {
        const self = this;
        js = self._fixProfile(js);
        this._geography = new Geography(js.geography);
        this._parents = js.geography.parents.map(el => new Geography(el));
        this._highlights = js.highlights;
        this._profileData = js.profile_data;
        this._feedback = js.feedback;

        Object.values(this._profileData).forEach(category => {
            category = self._fixCategory(category)
            Object.values(category.subcategories).forEach(subcategory => {
                subcategory = self._fixSubcategory(subcategory)
                Object.values(subcategory.indicators).forEach(indicator => {
                    indicator = IndicatorHelper.fixIndicator(indicator)

                    indicator.subindicators = Object
                        .entries(indicator.subindicators)
                        .map(s => new SubIndicator(s, indicator.choropleth_method))
                })
            })
        })
    }


    _fixProfile(profile) {
        if (profile.highlights == undefined)
            profile.highlights = [];

        return profile
    }

    _fixCategory(category) {
        if (category.subcategories == undefined)
            category.subcategories = {}

        return category
    }

    _fixSubcategory(subcategory) {
        if (subcategory.indicators == undefined)
            subcategory.indicators = {}

        if (subcategory.keyMetrics == undefined)
            subcategory.keyMetrics = {}

        return subcategory
    }

    get parents() {
        return this._parents;
    }

    get geography() {
        return this._geography;
    }

    get highlights() {
        return this._highlights;
    }

    get profileData() {
        return this._profileData;
    }

    get keyMetrics() {
        return this._keyMetrics;
    }

    get feedback() {
        return this._feedback;
    }
}

export class DataBundle {
    constructor(js) {
        // GeoJson geometries
        this._geometries = {
            boundary: js.boundary,
            children: js.children, // Dictionary keyed by child type
            parents: js.parent_layers, // Array of parent geographies
            themes: js.themes,
        }
        this._profile = new Profile(js.profile);
        this._logo = js.profile.logo;
        this._overview = js.profile.overview;
    }

    get geometries() {
        return this._geometries;
    }

    get profile() {
        return this._profile;
    }

    get logo() {
        return this._logo;
    }

    get overview() {
        return this._overview;
    }

    // get childGeographies() {
    //     let preferredChild;
    //     const level = this.profile.geography.level;
    //     preferredChild = geography_config.preferredChildren[level];

    //     return this.geometries.children[preferredChild];
    // }

    // get childCodes() {
    //     const geographies = this.childGeographies;
    //     return geographies.features.map(feature => {
    //         return feature.properties.code;
    //     })
    // }
}

export const MISSING_VALUE = 0;

export class SubIndicator {
    constructor(entry, choropleth_method) {
        const key = entry[0]
        const js = entry[1]

        this._choropleth_method = choropleth_method;

        this._keys = key;
        if (js["Count"] != undefined)
            this._count = js["Count"];
        else if (js["count"] != undefined)
            this._count = js["count"];
        else
            this._count = MISSING_VALUE;

        this._children = js.children;
    }

    get choropleth_method() {
        return this._choropleth_method;
    }

    get keys() {
        return this._keys;
    }

    get label() {
        if (Array.isArray(this._keys))
            return Object.values(this._keys).join("/")
        return this._keys
    }

    get children() {
        return this._children;
    }

    get count() {
        return this._count;
    }

    get value() {
        return this.count;
    }
}
