import {getJSON} from './utils' 
import GeographyProvider from './geography_provider'
import {Geography} from './geography_provider'

const baseUrl = "https://mapit.openup.org.za";
const baseAreasUrl = baseUrl + "/areas";
const defaultParams = "generation=2&simplify_tolerance=0.005";

export const MAPITSA = 'ZA'; // South Africa MapIt code

class MapItApiHelper {
	constructor(queryParams=defaultParams) {
		this.queryParams = queryParams;
	};

	generateChildrenUrl(parentMapItId) {
		const url = `${baseUrl}/area/${parentMapItId}/children.json`;
		return url;
	};

	generateAreaGeographiesUrl(areaCodes) {
		const url = `${baseUrl}/areas/${areaCodes.join(",")}.geojson?${this.queryParams}`;
		return url;
	};

	loadChildren(parentMapItId) {
		const self = this;
		const url = this.generateChildrenUrl(parentMapItId);

		return getJSON(url);
	};

	loadGeography(code) {
		const url = `${baseUrl}/area/${code}.json`;
		return getJSON(url);
	}

	loadAreaGeographies(mapItIds) {
		const self = this;
		const url = this.generateAreaGeographiesUrl(mapItIds);

		return getJSON(url).then(geojson => {
			const features = geojson.features;

			return geojson;
		});
	}
}


/**
 * A MapIt-extension of the Geography object
 * It is lazy-loaded meaning that missing properties are loaded on demand
 * It receives a provider that can create parent or child geographies in its construct
 */
class MapItGeography extends Geography {
	constructor(geoprovider, code) {
		super(code);
		this.provider = geoprovider;
	}

	_get_parent() {
		if (this._parentId != null) {
			return Promise.resolve(this.provider._getGeographyById(this._parentId));
		}
		return Promise.resolve(null);
	}

	get_parent() {
		const self = this;

		if (this._parent == null) {
			return this._get_parent().then(parent => {
				self._parent = parent;
				return this._parent;
			});
		}

		return this._parent;
	}

	_get_children() {
		return Promise.resolve(this.provider.getChildren(this.code));
	}

	get_children() {
		if (this._children == undefined || this._children.length == 0) {
			return this._get_children().then(children => {
				this._children = children;
				return children;
			})
		}
		return Promise.resolve(this.children);
	}

	_get_geometry() {
		return Promise.resolve(this.provider.getGeometry(this.code));
	}

	get_geometry() {
		if (this._geometry == null) {
			return this._get_geometry().then(geometry => {
				this._geometry = geometry;
				return geometry;
			});
		}
		return this._geometry;
	}

	get type() {
		return this._type;
	}

	get id() {
		return this._id;
	}
}


/**
 * MapIt can be queries by mapitid or by area code. Area codes are prefixed with "MDB:"
 */
export class MapItGeographyProvider extends GeographyProvider {
	constructor() {
		super();
		this.api = new MapItApiHelper();
		this.geographies = {}
	}

	getGeography(code) {
		if (this.geographies[code] == undefined) {
			return this._getGeographyByCode(code).then(geog => {
				this.geographies[code] = geog;
				return geog;
			});
		}
		return Promise.resolve(this.geographies[code]);
	}

	getChildren(code) {
		return this.getGeography(code).then(geography => {
			if (geography._children != undefined && geography._children.length > 0)
				return geography._children
			else {
				return this.api.loadChildren(`MDB:${code}`).then(js => {
					const children = [];
					geography._children = children;
					for (const [id, childjs] of Object.entries(js)) {
						let geography = this._createGeography(childjs);
						children.push(geography);
						this.geographies[geography.code] = geography;
					}
					return children;
				})
			}
		});
	}

	getGeometry(code, loadChildren=false) {
		const self = this;
		return this.getGeography(code).then(geog => {
			if (!loadChildren) {
				if (geog.geometry == null)
					return Promise.resolve(self.api.loadAreaGeographies(`MDB:${code}`));
			} else {
				return geog.get_children().then(children => {
					const childrenWithoutGeometries = children.filter(child => child._geometry == null);
					const codes = childrenWithoutGeometries.map(child => `MDB:${child.code}`)
					return self.api.loadAreaGeographies(codes).then(geojson => {
						if (codes.length > 0) {
							const features = Object.values(geojson.features);
							features.forEach(feature => {
								let childCode = feature.properties.codes.MDB;
								let childGeography = self.geographies[childCode]
								childGeography._geometry = feature;
							})
						}
						// TODO do I return children or their geometries
						return children.map(child => child._geometry);

					});

				});
			}

		})
	}

	childGeometries(code) {
		const loadChildGeographies = true;
		return this.getGeometry(code, loadChildGeographies).then(children => {
			const geojson = {
				features: children,
				type: "FeatureCollection"
			}

			return geojson
		});
	}

	_createGeography(js) {
		const code = js.codes.MDB;
		const geography = new MapItGeography(this, code);

		geography._parentId = js.parent_area;
		geography._type = js.type_name;
		geography._id = js.id;

		return geography	
	}


	_getGeographyByCode(code) {
		const self = this;
		const areaCode = `MDB:${code}`;
		return self._getGeographyById(areaCode);
	}

	_getGeographyById(mapitid) {
		const self = this;
		return this.api.loadGeography(mapitid).then(js => self._createGeography(js))
	}

}
