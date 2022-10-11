import {defaultValues} from './defaultValues';
import {ContentBlock} from './profile/blocks/content_block';
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
        let emptyMetadata = {
            source: '',
            description: '',
            url: null,
            licence: {
                name: '',
                url: null
            }
        }

        return fillMissingKeys(indicator.metadata, emptyMetadata);
    }

    static getChartConfiguration(chart_configuration) {
        return fillMissingKeys(chart_configuration, defaultValues.chartConfiguration || {})
    }

    static fixIndicator(title, indicator) {
        indicator.metadata = this.getMetadata(indicator)
        indicator.chartConfiguration = this.getChartConfiguration(indicator.chart_configuration)

        if (indicator.type == undefined) {
            console.warn(`Indicator ${title} does not have a type`)
            indicator.type = ContentBlock.BLOCK_TYPES.Indicator
        } else if (indicator.type == ContentBlock.BLOCK_TYPES.HTMLBlock) { // Not sure why this isn't working
            if (indicator.html == undefined)
                indicator.html = '';
        }

        if (indicator.groups == null || indicator.groups == undefined)
            indicator.groups = [];
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

        Object.values(this._profileData).forEach(category => {
            category = Profile.fixCategory(category)
            Object.values(category.subcategories).forEach(subcategory => {
                subcategory = Profile.fixSubcategory(subcategory)
                for (let [title, indicator] of Object.entries(subcategory.indicators)) {
                    indicator = IndicatorHelper.fixIndicator(title, indicator)
                }
            })
        })
    }


    _fixProfile(profile) {
        if (profile.highlights == undefined)
            profile.highlights = [];

        return profile
    }

    static fixCategory(category) {
        if (category.subcategories === undefined)
            category.subcategories = {}

        return category
    }

    static fixSubcategory(subcategory) {
        if (subcategory.indicators === undefined)
            subcategory.indicators = {}

        if (subcategory.key_metrics === undefined)
            subcategory.key_metrics = [];

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

export class ChildrenIndicators {
    constructor(data) {
        this._data = data;

        Object.values(this._data).forEach(category => {
            category = Profile.fixCategory(category)
            Object.values(category.subcategories).forEach(subcategory => {
                subcategory = Profile.fixSubcategory(subcategory)
                for (let [title, indicator] of Object.entries(subcategory.indicators)) {
                    indicator = IndicatorHelper.fixIndicator(title, indicator)
                }
            })
        })
    }

    get data() {
        return this._data;
    }
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
