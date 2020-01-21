import {getJSON} from '../utils' 
import GeographyProvider from './geography_provider'
import {Geography} from './geography_provider'

export class WazimapProvider extends GeographyProvider {
    constructor(baseUrl) {
        super();
        this.geographies = {};
        this.baseUrl = baseUrl;
        this.defaultGeography = "ZA"; 
    }

    _createGeography(js) {
        const code = js.properties.code;
        const geography = new Geography(this, code);

        geography._parentId = js.properties.parent;
        geography._type = js.properties.level;
        geography._id = js.properties.code;

        return geography    
    }

    /**
     * Returns a geography object for the given code
     * @param  {[type]} code [description]
     * @return {[type]}      [description]
     */
    getGeography(code) {
        const self = this;

        if (this.geographies[code] == undefined) {
            const url = `${this.baseUrl}/boundaries/${code}/`;
            return getJSON(url).then(js => {
                const geography = self._createGeography(js);
                return geography;
            })
        }
        return Promise.resolve(this.geographies[code]);
    } 


    /**
     * Get child geographies for the given geography code
     * @param  {[type]} code      code for parent geography
     * @param  {[type]} childtype filter by childtype is multiple are availble, e.g subplace, ward
     * @return {[type]}           list of Geography objects
     */
    getChildren(code, childtype) {

    }

    /**
     * [childGeometries description]
     * @param  {[type]} code      [description]
     * @param  {[type]} childtype relevant if there are different childtypes - e.g. ward and mainplaces
     * @return {[type]}           [description]
     */
     // TODO implement childtype
    childGeometries(code, childtype) {
        const url = `${this.baseUrl}/boundaries/${code}/children/?dsf33idfdhhdddd`;
        return getJSON(url)
    }
}