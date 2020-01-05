import {interpolateBlues as d3interpolateBlues} from 'd3-scale-chromatic';
import {scaleSequential as d3scaleSequential} from 'd3-scale';
import {min as d3min, max as d3max} from 'd3-array';

import MapIt from './mapit';
import {Observer} from './utils';

var defaultCoordinates = {"lat": -28.995409163308832, "long": 25.093833387362697, "zoom": 6};
var defaultTileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
var MAPITSA = 4577; // South Africa MapIt code

var defaultStyles = {
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

function LayerStyler(styles) {
    this.styles = styles || defaultStyles;
}

LayerStyler.prototype = {
    setLayerStyle: function(layer, styles) {
        layer.resetStyle();
        layer.eachLayer(function(feature) {
            feature.setStyle(styles.out);

            feature
                .off("mouseover mouseout")
                .on("mouseover", function(el) {
                    feature.setStyle(styles.over);
                })
                .on("mouseout", function(el) {
                    feature.setStyle(styles.out);
            })
        })
    },

    setLayerToHoverOnly: function(layer) {
        this.setLayerStyle(layer, this.styles.hoverOnly);
    },

    setLayerToSelected: function(layer) {
        this.setLayerStyle(layer, this.styles.selected);
    },
}

export function MapControl(config) {
    config = config || {}

    var coords = config.coords || defaultCoordinates;
    var tileUrl = config.zoomMap || defaultTileUrl;

    this.zoomMap = config.zoomMap || true;
    this.boundaryLayers = null;

    this.layerCache = new LayerCache();
    this.observer = new Observer();
    this.layerStyler = new LayerStyler();

    this.map = this.configureMap(coords, tileUrl);
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

    /* Observer method */
    on: function(event, func) {
        this.observer.on(event, func);
    },

    /* Observer method */
    triggerEvent: function(event, payload) {
        this.observer.triggerEvent(event, payload);
    },

    /**
     * Handles creating a choropleth when a subindicator is clicked
     * @param  {[type]} data    An object that contains subindictors and obj
     */
    choropleth: function(data) {
        var self = this

        var childGeographies = Object.entries(data.obj.children).map(function(childGeography) {
            var code = childGeography[0];
            var count = childGeography[1];
            var universe = data.subindicators.reduce(function(el1, el2) {
              if (el2.children != undefined && el2.children[code] != undefined)
                return el1 + el2.children[code];
              return el1;
            }, 0)
            var val = count / universe;
            return {code: code, val: val};
        })

        var values = childGeographies.map(function(el) {
          return el.val;
        })

        var scale = d3scaleSequential(d3interpolateBlues).domain([d3min(values), d3max(values)])

        childGeographies.forEach(function(el) {
          var layer = self.layerCache.geoMap[el.code];
          var color = scale(el.val);
          layer.setStyle({fillColor: color});
        })
    },

    overlayBoundaries: function(areaCode) {
        var self = this;

        self.layerCache.getLayer(areaCode).then(function(layers) {
            self.boundaryLayers.clearLayers();

            var secondaryLayers = layers.slice(1).reverse();
            var mainLayer = layers[0];

            secondaryLayers.forEach(function(layer) {
                self.layerStyler.setLayerToHoverOnly(layer);
                self.boundaryLayers.addLayer(layer);

            })

            self.layerStyler.setLayerToSelected(mainLayer);
            self.boundaryLayers.addLayer(mainLayer);

            var alreadyZoomed = false;

            var layerPayload = function(layer) {
                var prop = layer.layer.feature.properties;
                return {
                    areaCode: prop.codes.MDB,
                    layer: layer.layer,
                    element: layer,
                    properties: prop,
                }
            }

            layers.forEach(function(layer) {
                layer
                    .off("click")
                    .on("click", function(el) {
                        var prop = el.layer.feature.properties;
                        var areaCode = prop.id;
                        self.overlayBoundaries(areaCode);
                        self.triggerEvent("layerClick", layerPayload(el));
                    }) 
                    .on("mouseover", function(el) {
                        self.triggerEvent("layerMouseOver", layerPayload(el));
                    })
                    .on("mouseout", function(el) {
                        self.triggerEvent("layerMouseOut", layerPayload(el));
                    })
                    .addTo(self.map);

                    if (self.zoomMap && !alreadyZoomed) {
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
