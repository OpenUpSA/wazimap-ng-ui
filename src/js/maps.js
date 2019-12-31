import MapIt from './mapit';

var defaultCoordinates = {"lat": -28.995409163308832, "long": 25.093833387362697, "zoom": 6};
var defaultTileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
var MAPITSA = 4577; // South Africa MapIt code

export function MapControl(coords, tileUrl) {
    if (coords == undefined)
        var coords = defaultCoordinates;

    if (tileUrl == undefined)
        var tileUrl = defaultTileUrl;

    this.map = this.configureMap(coords, tileUrl);

    this.layerCache = new LayerCache();

    this.eventListeners = {};

    this.styles = {
        hoverOnly: {
            over: {
                fillColor: "darkred",
            },
            out: {
                fillColor: "#ffffff",
                opacity: "0%",
                stroke: false,
            } 
        },
        selected: {
            over: {
                color: "darkred"
            },
            out: {
                color: "red",
                opacity: 1,
                weight: 1
            }
        }
    }
}

MapControl.prototype = {
    configureMap: function(coords, tileUrl) {

        var map = L
            .map('main-map', { zoomControl: false})
            .setView([coords["lat"], coords["long"]], coords["zoom"])

        L.tileLayer(tileUrl).addTo(map);
        L.control.zoom({position: 'topright'}).addTo(map);
        this.boundaryLayers = L.layerGroup().addTo(map);
        return map;
    },

    on: function(event, func) {
        if (this.eventListeners[event] == undefined)
            this.eventListeners[event] = [];

        this.eventListeners[event].push(func);
    },

    triggerEvent: function(event, payload) {
        if (this.eventListeners[event] != undefined) {
            this.eventListeners[event].forEach(function(listener) {
                listener(payload);
            });
        }
    },

    setLayerStyle: function(layer, style) {
        var self = this;
        layer.resetStyle();
        layer.eachLayer(function(feature) {
            feature.setStyle(style.out);
            feature.off("mouseover mouseout");
            feature
                .on("mouseover", function(el) {
                    feature.setStyle(style.over);
                })
                .on("mouseout", function(el) {
                    feature.setStyle(style.out);
                })
        })
    },

    setLayerToHoverOnly: function(layer) {
        var self = this;
        this.setLayerStyle(layer, this.styles.hoverOnly);
    },

    setLayerToSelected: function(layer) {
        var self = this;
        this.setLayerStyle(layer, this.styles.selected);
    },

    overlayBoundaries: function(areaCode) {
        var self = this;

        self.layerCache.getLayer(areaCode).then(function(layers) {
            self.boundaryLayers.clearLayers();

            var secondaryLayers = layers.slice(1).reverse();
            var mainLayer = layers[0];

            secondaryLayers.forEach(function(layer) {
                self.setLayerToHoverOnly(layer);
                self.boundaryLayers.addLayer(layer);

            })

            self.setLayerToSelected(mainLayer);
            self.boundaryLayers.addLayer(mainLayer);

            var alreadyZoomed = false;

            layers.forEach(function(layer) {
                layer
                    .off("click")
                    .on("click", function(el) {
                        var prop = el.layer.feature.properties;
                        var areaCode = prop.id;
                        self.overlayBoundaries(areaCode);
                        self.triggerEvent("geoselect", prop.codes.MDB);
                    }) 
                    .addTo(self.map);
                    if (!alreadyZoomed) {
                        try {
                                self.map.fitBounds(layer.getBounds());
                                alreadyZoomed = true;
                        } catch (err) {
                            console.log("Error zooming: " + err);
                        }
                    }
            })
        });

    }, 
}

/**
A tree-hash cache for map boundary layers
Every geograpy node is indexed by level_code
A node contains the following attributes:
    - layer
    - parent layer
    - code
*/
export function LayerCache() {
    this.mapit = new MapIt();
    this.geoMap = {};
}

LayerCache.prototype = {

    hashGeographies: function(layer) {
        var self = this;
        layer.eachLayer(function(l) {
            var props = l.feature.properties;
            var code = props.codes.MDB;
            self.geoMap[code] = l; 
        })
    },
    /**
     * Return an array of Leaflet layers to be displayed
     * @param  {[type]}
     * @param  {Function}
     * @return {[type]}
     */
    getLayer: function(areaCode, layers) {
        var self = this;
        return new Promise(function(resolve, reject) {

            if (areaCode == null)
                areaCode = MAPITSA;

            if (layers == undefined)
                layers = [];

            var sequence = self.mapit.getGeography(areaCode)
                .then(function(geography) {
                    var parentAreaCode = geography.parent;
                    self.mapit.toGeoJSON(geography.id).then(function(geojson) {
                        var layer = L.geoJson(geojson);
                        self.hashGeographies(layer);
                        var hasGeometries = layer.getLayers().length > 0;
                        if (hasGeometries)
                            layers.push(layer);

                        if (parentAreaCode != null) {
                            self.getLayer(parentAreaCode, layers)
                                .then(function(layers) {
                                    resolve(layers);
                                });
                        } else {
                            resolve(layers);
                        }

                    });
                })
        })

    },
}
