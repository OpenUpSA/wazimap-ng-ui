import {interpolateBlues as d3interpolateBlues} from 'd3-scale-chromatic';
import {scaleSequential as d3scaleSequential} from 'd3-scale';
import {min as d3min, max as d3max} from 'd3-array';
import {Observable, numFmt} from './utils';
import {geography_config} from './geography_providers/geography_sa';

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
        var tileUrl = config.tileUrl || defaultTileUrl;

        this.zoomEnabled = config.zoomMap || false;
        this.boundaryLayers = null;
        this.mainLayer = null;

        this.layerStyler = new LayerStyler();

        this.map = this.configureMap(coords, tileUrl);
        this.layerCache = {};
        this.map.on("zoomend", e => this.zoomChanged(e));
    };

    enableZoom(enabled) {
        this.zoomEnabled = enabled;
    }

    zoomChanged(e) {
        if (!this.zoomEnabled)
            return;

        if (e.sourceTarget._popup === null || typeof e.sourceTarget._popup === 'undefined') {
            return;
        }

        let area = e.sourceTarget._popup._content;
        let zoomLvl = e.sourceTarget._zoom;
        let areaCode = e.sourceTarget._popup._source.feature.properties.code;
        let level = e.sourceTarget._popup._source.feature.properties.level;

        const hash = decodeURI(window.location.hash);
        let parts = hash.split(":")

        if (zoomLvl < 7) {
            window.location.hash = "";
        } else if (zoomLvl >= 11 && level === 'Subplace') {
            window.location.hash = "#geo:" + areaCode;
        } else if (zoomLvl >= 10 && level === 'Mainplace') {
            window.location.hash = "#geo:" + areaCode;
        } else if (zoomLvl >= 9 && level === 'Municipality') {
            window.location.hash = "#geo:" + areaCode;
        } else if (zoomLvl >= 8 && level === 'District') {
            window.location.hash = "#geo:" + areaCode;
        } else if (zoomLvl >= 7 && level === 'Province') {
            window.location.hash = "#geo:" + areaCode;
        }
    }

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
                            // TODO temporary - will integrate into Webflow HTML
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
        const self = this
        // const children = data.profile.children;
        const childCodes = data.profile.childCodes;

        function resetLayers(childCodes) {
            childCodes.forEach(childCode => {
                  const layer = self.layerCache[childCode];
                  const color = scale(0);
                  if (layer != undefined)
                      layer.setStyle({fillColor: color});
            });

        }


        // if (children == undefined || children.length == 0)
        //     return

        const childGeographies = Object.entries(data.subindicator.obj.children).map(childGeography => {
            const code = childGeography[0];
            const count = childGeography[1];
            const universe = data.subindicator.subindicators.reduce((el1, el2) => {
              if (el2.children != undefined && el2.children[code] != undefined)
                return el1 + el2.children[code];
              return el1;
            }, 0)
            const val = count / universe;
            return {code: code, val: val};
        })

        const values = childGeographies.map(el => el.val);
        const scale = d3scaleSequential(d3interpolateBlues).domain([d3min(values), d3max(values)])

        resetLayers(childCodes);

        childGeographies.forEach((el) => {
          const layer = self.layerCache[el.code];
          const color = scale(el.val);
          layer.setStyle({fillColor: color});
        })
    };
    
    resetChoropleth() {
        self = this;
        self.layerStyler.setLayerToSelected(self.mainLayer);
    }

    overlayBoundaries(geography, geometries, zoomNeeded=false) {
        const self = this;
        const level = geography.level;
        const preferredChild = geography_config.preferredChildren[level];
        let selectedBoundary;
        const parentBoundaries = geometries.parents;

		self.triggerEvent("layerLoading", self.map);
        if (Object.values(geometries.children).length == 0)
            selectedBoundary = geometries.boundary;
        else
            selectedBoundary = geometries.children[preferredChild];

        const layers = [selectedBoundary, ...parentBoundaries].map(l => {
            const leafletLayer = L.geoJson(l);
            leafletLayer.eachLayer(l => {
                let code = l.feature.properties.code;
                self.layerCache[code] = l;
            })
            self.layerCache[geography.code] = leafletLayer;
            return leafletLayer;
        });
	   	
        self.boundaryLayers.clearLayers();

        var secondaryLayers = layers.slice(1);
        self.mainLayer = layers[0];

        secondaryLayers.forEach((layer) => {
            self.layerStyler.setLayerToHoverOnly(layer);
            self.boundaryLayers.addLayer(layer);

        })

        self.layerStyler.setLayerToSelected(self.mainLayer);
        self.boundaryLayers.addLayer(self.mainLayer);

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

        layers.forEach(layer => {
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

                if (!alreadyZoomed) {
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
