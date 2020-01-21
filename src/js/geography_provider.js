export class Geography {
    constructor(code) {
        this._code = code;
        this._parent = null;
        this._geometry = null;
        this._children = [];
    }

    get code() {
        return this._code;

    }

    get parent() {
        console.log("get parent 1")
        return this._parent;
    }

    get geometry() {
        return this._geometry;
    }

    get children() {
        return this._children;
    }

}

export default class GeographyProvider {
    constructor() {
       this.defaultGeography = null; 
    }
    /**
     * Returns a geography object for the given code
     * @param  {[type]} code [description]
     * @return {[type]}      [description]
     */
    getGeography(code) {

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
     * Get child geojson for the given geography code
     * @param  {[type]} code      code for parent geography
     * @param  {[type]} childtype filter by childtype is multiple are availble, e.g subplace, ward
     * @return {[type]}           list of Geography objects
     */
    childGeometries(code, childtype) {

    }
}