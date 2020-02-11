import {geography_config} from './geography_providers/geography_sa';

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

export class Profile {
    constructor(js) {
        this._geography = new Geography(js.geography);
        this._parents = js.geography.parents.map(el => new Geography(el));
        this._highlights = js.highlights;
        this._profileData = js.profile_data;
        this._keyMetrics = js.key_metrics

        Object.values(this._profileData).forEach(category => {
            Object.values(category.subcategories).forEach(subcategory => {
                Object.values(subcategory.indicators).forEach(indicator => {
                    indicator.subindicators = indicator.subindicators.map(s => new SubIndicator(s))
                })
            })
        })
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
}

export class DataBundle {
    constructor(js) {
        // GeoJson geometries
        this._geometries = {
            boundary: js.boundary,
            children: js.children, // Dictionary keyed by child type
            parents: js.parent_layers // Array of parent geographies
        }
        this._profile = new Profile(js.profile);
    }

    get geometries() {
        return this._geometries;
    }

    get profile() {
        return this._profile;
    }

    get childGeographies() {
        let preferredChild;
        const level = this.profile.geography.level;
        preferredChild = geography_config.preferredChildren[level];

        return this.geometries.children[preferredChild];
    }

    get childCodes() {
        const geographies = this.childGeographies;
        return geographies.features.map(feature => {
            return feature.properties.code;
        })
    }
}

export class SubIndicator {
    constructor(js) {
        const copy = {...js}
        delete copy["Count"];
        delete copy["count"];
        delete copy["label"]
        delete copy["value"]
        delete copy["children"]

        this._keys = copy;
        if (js["Count"] != undefined)
            this._count = js["Count"];
        else if (js["count"] != undefined)
            this._count = js["count"];
        else
            this._count = 0; 

        this._children = js.children;
    }

    get keys() {
        return this._keys;
    }

    get label() {
        return Object.values(this._keys).join("/")
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