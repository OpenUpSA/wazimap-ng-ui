import {interpolateBlues as d3interpolateBlues} from 'd3-scale-chromatic';
import {scaleSequential as d3scaleSequential} from 'd3-scale';
import {min as d3min, max as d3max} from 'd3-array';
import {Observable, numFmt} from './utils';

const defaultCoordinates = {"lat": -28.995409163308832, "long": 25.093833387362697, "zoom": 6};
const defaultTileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

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

class LayerStyler {
    constructor(styles) {
        this.styles = styles || defaultStyles;
    }

    setLayerStyle(layer, styles) {
        layer.resetStyle();
        layer.eachLayer((feature) => {
            feature.setStyle(styles.out);

            feature
                .off("mouseover mouseout")
                .on("mouseover", (el) => {
                    feature.setStyle(styles.over);
                })
                .on("mouseout", (el) => {
                    feature.setStyle(styles.out);
            })
        })
    };

    setLayerToHoverOnly(layer) {
        this.setLayerStyle(layer, this.styles.hoverOnly);
    };

    setLayerToSelected(layer) {
        this.setLayerStyle(layer, this.styles.selected);
    };
}

export class MapControl extends Observable {
    constructor(geographyProvider, config) {
        super();
        config = config || {}

        var coords = config.coords || defaultCoordinates;
        var tileUrl = config.zoomMap || defaultTileUrl;

        this.zoomMap = config.zoomMap || true;
        this.boundaryLayers = null;

        this.layerStyler = new LayerStyler();

        this.map = this.configureMap(coords, tileUrl);
        this.layerCache = {};
    };

    onSizeUpdate() {
        setTimeout(() => {
            this.map.invalidateSize(true);
        }, 500);
    }

    configureMap(coords, tileUrl) {

        const map = L
            .map('main-map', { zoomControl: false})
            .setView([coords["lat"], coords["long"]], coords["zoom"])

        L.tileLayer(tileUrl).addTo(map);
        L.control.zoom({position: 'bottomright'}).addTo(map);
        this.boundaryLayers = L.layerGroup().addTo(map);

        return map;
    };

    loadPopup(payload) {
        const state = payload.state;
        var payload = payload.payload;
        var popupLabel = payload.properties.name;
        var areaCode = payload.areaCode;
        const popup = L.popup({autoPan: false})

        if (state.subindicator != null) {
            const subindicators = state.subindicator.subindicators;
            const subindicator = state.subindicator.obj.key;
            const subindicatorValues = subindicators.filter(s => (s.key == subindicator));
            if (subindicatorValues.length > 0) {
                const subindicatorValue = subindicatorValues[0];
                if (subindicatorValue != undefined && subindicatorValue.children != undefined) {
                    for (const [geographyCode, count] of Object.entries(subindicatorValue.children)) {
                        if (geographyCode == areaCode) {
                            const countFmt = numFmt(count);
                            popupLabel = `<strong>${popupLabel}</strong>`;
                            popupLabel += `<br>${state.subindicator.indicator} (${subindicatorValue.key}): ${countFmt}`;
                        }
                    }

                }

            }
        }
        popup.setContent(popupLabel)
        payload.layer.bindPopup(popup).openPopup();

    }


    /**
     * Handles creating a choropleth when a subindicator is clicked
     * @param  {[type]} data    An object that contains subindictors and obj
     */
    choropleth(data) {
        var self = this

        var childGeographies = Object.entries(data.payload.obj.children).map(childGeography => {
            var code = childGeography[0];
            var count = childGeography[1];
            var universe = data.payload.subindicators.reduce((el1, el2) => {
              if (el2.children != undefined && el2.children[code] != undefined)
                return el1 + el2.children[code];
              return el1;
            }, 0)
            var val = count / universe;
            return {code: code, val: val};
        })

        var values = childGeographies.map((el) => {
          return el.val;
        })

        var scale = d3scaleSequential(d3interpolateBlues).domain([d3min(values), d3max(values)])

        childGeographies.forEach((el) => {
          var layer = self.layerCache[el.code];
          var color = scale(el.val);
          layer.setStyle({fillColor: color});
        })
    };

    overlayBoundaries(payload) {
        const self = this;
        const boundaryLayers = [];

		self.triggerEvent("layerLoading", self.map);
        let selectedBoundary = payload.payload.children;
        if (Object.values(payload.payload.children).length == 0)
            selectedBoundary = payload.payload.boundary;

        const parentBoundaries = payload.payload.parent_layers;
        const layers = [selectedBoundary, ...parentBoundaries].map(l => {
            const leafletLayer = L.geoJson(l);
            const code = payload.payload.profile.geography.code;
            leafletLayer.eachLayer(l => {
                let code = l.feature.properties.code;
                self.layerCache[code] = l;
            })
            self.layerCache[code] = leafletLayer;
            return leafletLayer;
        });
	   	
        self.boundaryLayers.clearLayers();

        var secondaryLayers = layers.slice(1);
        var mainLayer = layers[0];

        secondaryLayers.forEach((layer) => {
            self.layerStyler.setLayerToHoverOnly(layer);
            self.boundaryLayers.addLayer(layer);

        })

        self.layerStyler.setLayerToSelected(mainLayer);
        self.boundaryLayers.addLayer(mainLayer);

        var alreadyZoomed = false;

        var layerPayload = function(layer) {
            var prop = layer.layer.feature.properties;
            return {
                areaCode: prop.code,
                layer: layer.layer,
                element: layer,
                properties: prop,
            }
        }

        layers.forEach((layer) => {
            layer
                .off("click")
                .on("click", (el) => {
                    const prop = el.layer.feature.properties;
                    const areaCode = prop.code;
                    self.triggerEvent("layerClick", layerPayload(el));
                }) 
                .on("mouseover", (el) => {
                    self.triggerEvent("layerMouseOver", layerPayload(el));
                })
                .on("mouseout", (el) => {
                    self.triggerEvent("layerMouseOut", layerPayload(el));
                })
                .addTo(self.map);

                if (self.zoomMap && !alreadyZoomed) {
                    try {
                        self.map.flyToBounds(layer.getBounds(), {
                            animate: true,
                            duration: 0.5 // in seconds
                        });
                        alreadyZoomed = true;
                    } catch (err) {
                        console.log("Error zooming: " + err);
                    }
                }
        })
		
		self.triggerEvent("layerLoadingDone", self.map);
    };
}
