var baseUrl = "https://mapit.openup.org.za";
var baseAreasUrl = baseUrl + "/areas";
var defaultParams = "generation=2&simplify_tolerance=0.005";

var levelMap = {
    country: {code: "CY", childLevel: "province", },
    province: {code: "PR", childLevel: "district"},
    district: {code: "DC", childLevel: "municipality"},
    municipality: {code: "MN", childLevel: "subplace"},
    mainplace: {code: "MP", childLevel: "subplace"},
    subplace: {code: "SP", childLevel: null },
}

export default function MapIt(queryParams) {
	if (queryParams != undefined)
		this.queryParams = queryParams;
	else
		this.queryParams = defaultParams;

	this.areaIds = {};

}

var getJSON = function(url) {
	return Promise.resolve($.getJSON(url));
}

MapIt.prototype = {
	createGeography: function(areaCode, data) {
		if (this.areaIds[areaCode] == undefined) {
			this.areaIds[areaCode] = data;
		}
	},

	getGeography: function(areaCode) {
		var self = this;

		if (self.areaIds[areaCode] != undefined)
			return new Promise(function(resolve, reject) {
				resolve(self.areaIds[areaCode])
			})
		else {
			return new Promise(function(resolve, reject) {
				self.getChildren(areaCode).then(function(children) {
					var childCodes = children.map(function(el) {
						return el.id;	
					})

					self.areaIds[areaCode] = {
						children: childCodes,
						parent: null, // TODO need to figure out how to get this
						geojson: null, // TODO should this be retrieved?
						id: areaCode
					};

					resolve(self.areaIds[areaCode])
				})
			})
		}
	},

	getChildrenUrl: function(parentAreaCode) {
		var url = `${baseUrl}/area/${parentAreaCode}/children.json`;
		return url;
	},

	/**
	Returns the children of the given parent area code
	e.g. https://mapit.openup.org.za/area/4577/children.json
	 * @param  {int} areaCode	MapIt area code of parent
	 * @param  {Function}
	 * @return {[type]}
	 */
	getChildren: function(parentAreaCode) {
		var self = this;
		return new Promise(function(resolve, reject) {
			if (self.areaIds[parentAreaCode] != undefined && self.areaIds[parentAreaCode].children != undefined) {
				var childCodes = self.areaIds[parentAreaCode].children;
				self.getAreaGeographies(childCodes).then(function(geos) {
					resolve(geos);
				});
			} else {
				var url = self.getChildrenUrl(parentAreaCode);
				getJSON(url).then(function(data) {
					var childCodes = Object.keys(data);
					var geography = self.areaIds[parentAreaCode];

					if (geography == undefined)
						// TODO I don't like the duplication of geography creation - need to centralise
						self.createGeography(parentAreaCode, {
							children: childCodes,
							id: parentAreaCode,
							geojson: null,
							parent: null
						});
					else {
						geography.children = childCodes;	
					}
					self.getAreaGeographies(childCodes).then(function(geos) {
						resolve(geos);
					});
				})
			}

		})
	},

	getGeographiesGeometryUrl: function(areaCodes) {
		var url = `${baseUrl}/areas/${areaCodes.join(",")}/geometry?${this.queryParams}`;
		return url;
	},

	getGeographiesGeometry: function(areaCodes) {
		var self = this;
		var url = self.getGeographiesGeometryUrl(areaCodes);
		return new Promise(function(resolve, reject) {
			getJSON(url).then(function(json) {
				Object.keys(json).forEach(function(key) {
					if (self.areaIds[key] != undefined) {
						self.areaIds[key].geometry = json[key];
					}
				})
				resolve();
			}) 
		})
	},

	getAreaGeographiesUrl: function(areaCodes) {
		var url = `${baseUrl}/areas/${areaCodes.join(",")}.geojson?${this.queryParams}`;
		return url;
	},

	/**
	 * Download the geojson for the given area codes
	 * @param  {[type]}
	 * @param  {Function}
	 * @return {[geographies]}
	 */
	getAreaGeographies: function(areaCodes) {
		var self = this;

		return new Promise(function(resolve, reject) {
			var downloadCodes = areaCodes.filter(function(areaCode) {
				return self.areaIds[areaCode] == undefined;
			})

			if (downloadCodes.length > 0) {
				var url = self.getAreaGeographiesUrl(downloadCodes);
				getJSON(url).then(function(geojson) {
					var geographies = geojson.features;
					geographies.forEach(function(el) {
						var id = el.properties.id;
						if (self.areaIds[id] == undefined)
							self.createGeography(id, {});
						self.areaIds[id].geojson = el;
						self.areaIds[id].parent = el.properties.parent_area;
						self.areaIds[id].id = id;
					})
					self.getAreaGeographies(areaCodes)
						.then(function(geos) {
							resolve(geos);
						})
				})
			} else {
				var geos = areaCodes.map(function(areaCode) {
					return self.areaIds[areaCode];
				})

				resolve(geos);
			}

		})
	},

	toGeoJSON: function(parentAreaCode) {
		var self = this;
		return new Promise(function(resolve, reject) {
			var children = self.getChildren(parentAreaCode).then(function(children) {
				var geos = children.map(function(child) {
					return child.geojson;
				})

				var geojson = {
					features: geos,
					type: "FeatureCollection"
				}

				resolve(geojson);
			})

		})
	},
}