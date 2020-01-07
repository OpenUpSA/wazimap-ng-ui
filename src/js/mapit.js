import {getJSON} from './utils' 

const baseUrl = "https://mapit.openup.org.za";
const baseAreasUrl = baseUrl + "/areas";
const defaultParams = "generation=2&simplify_tolerance=0.005";

export const MAPITSA = 4577; // South Africa MapIt code

class MapItApiHelper {
	constructor(queryParams=defaultParams) {
		this.queryParams = queryParams;
	};

	generateChildrenUrl = (parentMapItId) => {
		var url = `${baseUrl}/area/${parentMapItId}/children.json`;
		return url;
	};

	generateAreaGeographiesUrl = (areaCodes) => {
		var url = `${baseUrl}/areas/${areaCodes.join(",")}.geojson?${this.queryParams}`;
		return url;
	};

	processGeography = (feature) => {
		if (feature.codes.MDB == "LIM")
			feature.codes.MDB = "LP"	
	}

	loadChildren = (parentMapItId) => {
		const self = this;
		const url = this.generateChildrenUrl(parentMapItId);

		return new Promise((resolve, reject) => {
			getJSON(url).then(data => {
				// TODO figure out how to isolate South Africa specific extensions
				for (const [key, val] of Object.entries(data)) {
					self.processGeography(val);

				}
				resolve(data)
			})
		})
	};

	loadAreaGeographies = (mapItIds) => {
		const self = this;
		const url = this.generateAreaGeographiesUrl(mapItIds);

		return new Promise((resolve, reject) => {
			getJSON(url).then(geojson => {
				console.log(geojson);
				const features = geojson.features;
				features.forEach((val) => {
					self.processGeography(val.properties);
				}) 
				resolve(geojson)
			})
		})
	}
}

/**
 * Class to manage caching MapIt data and maintaining a geographical hierarchy
 */
export default class MapIt {

	constructor() {
		this.areaIds = {};
		this.api = new MapItApiHelper();
	};

	createGeography = (mapItId, data) => {
		if (this.areaIds[mapItId] == undefined) {
			this.areaIds[mapItId] = data;
		}
	};

	getGeography = (mapItId) => {
		const self = this;
		const alreadyExists = mapItId => this.areaIds[mapItId] != undefined


		return new Promise(function(resolve, reject) {
			if (alreadyExists(mapItId))
				resolve(self.areaIds[mapItId])
			else {
				self.getChildGeographies(mapItId).then(childGeographies => {
					const childMapItIds = childGeographies.map(geography => geography.id);

					self.areaIds[mapItId] = {
						children: childMapItIds,
						parent: null, // TODO need to figure out how to get this
						geojson: null, // TODO should this be retrieved?
						id: mapItId
					};

					resolve(self.areaIds[mapItId])
				})
			}
		})
	};

	/**
	Returns the children of the given parent area code
	e.g. https://mapit.openup.org.za/area/4577/children.json
	 * @param  {int} areaCode	MapIt area code of parent
	 * @param  {Function}
	 * @return {[type]}
	 */
	getChildGeographies = (parentMapItId) => {
		const self = this;
		return new Promise((resolve, reject) => {
			const childrenExist = self.areaIds[parentMapItId] != undefined && self.areaIds[parentMapItId].children != undefined;

			if (childrenExist) {
				const childCodes = self.areaIds[parentMapItId].children;
				self.getAreaGeographies(childCodes).then(geos => resolve(geos));
			} else {
				self.api.loadChildren(parentMapItId).then(data => {
					const childCodes = Object.keys(data);
					const geography = self.areaIds[parentMapItId];

					if (geography == undefined) {
						// TODO I don't like the duplication of geography creation - need to centralise
						self.createGeography(parentMapItId, {
							children: childCodes,
							id: parentMapItId,
							geojson: null,
							parent: null
						});
					} else {
						geography.children = childCodes;	
					}
					self.getAreaGeographies(childCodes).then(geos => resolve(geos));
				})
			}
		})
	};

	/**
	 * Download the geojson for the given area codes
	 * @param  {[type]}
	 * @param  {Function}
	 * @return {[geographies]}
	 */
	getAreaGeographies = (mapItIds) => {
		const self = this;
		const notDownloaded = mapItId => self.areaIds[mapItId] == undefined;
		const updateGeography = geojsonFeature => {
			const mapItId = geojsonFeature.properties.id;
			if (notDownloaded(mapItId))
				self.createGeography(mapItId, {});
			self.areaIds[mapItId].geojson = geojsonFeature;
			self.areaIds[mapItId].parent = geojsonFeature.properties.parent_area;
			self.areaIds[mapItId].id = mapItId;

		}

		return new Promise((resolve, reject) => {
			const downloadCodes = mapItIds.filter(notDownloaded);

			if (downloadCodes.length > 0) {

				self.api.loadAreaGeographies(downloadCodes).then(geojson => {
					const geojsonFeatures = geojson.features;
					geojsonFeatures.forEach(updateGeography);

					const geos = mapItIds.map(mapItId => self.areaIds[mapItId]);
					resolve(geos);
				})
			} else {
				const geos = mapItIds.map(mapItId => self.areaIds[mapItId]);
				resolve(geos);
			}
		})
	};

	toGeoJSON = (parentMapItId) => {
		const self = this;
		return new Promise((resolve, reject) => {
			const children = self.getChildGeographies(parentMapItId).then(children => {
				const geos = children.map(child => child.geojson)

				const geojson = {
					features: geos,
					type: "FeatureCollection"
				}

				resolve(geojson);
			})

		})
	};
}