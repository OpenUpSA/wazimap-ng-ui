import {interpolateBlues as d3interpolateBlues} from 'd3-scale-chromatic';
import {scaleSequential as d3scaleSequential} from 'd3-scale';
import {min as d3min, max as d3max} from 'd3-array';

import {Observable} from './utils';

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

        this.layerCache = new LayerCache(geographyProvider);
        this.layerStyler = new LayerStyler();

        this.map = this.configureMap(coords, tileUrl);

        this.map.on('zoomend', (e) => {
            this.zoomChanged(e);
        });
    };

    onSizeUpdate() {
        setTimeout(() => {
            this.map.invalidateSize(true);
        }, 500);
    }

    zoomChanged = (e) => {
        if (e.sourceTarget._popup === null || typeof e.sourceTarget._popup === 'undefined') {
            return;
        }

        let area = e.sourceTarget._popup._content;
        let zoomLvl = e.sourceTarget._zoom;
        let areaCode = e.sourceTarget._popup._source.feature.properties.code;
        let level = e.sourceTarget._popup._source.feature.properties.level;

        const hash = decodeURI(window.location.hash);
        let parts = hash.split(":")

        console.log(zoomLvl + ' : ' + areaCode + ' : ' + parts + ' : ' + level);
        console.log(e)

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

    configureMap(coords, tileUrl) {

        const map = L
            .map('main-map', {zoomControl: false})
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
                for (const [geographyCode, count] of Object.entries(subindicatorValue.children)) {
                    if (geographyCode == areaCode) {
                        const countFmt = numFmt(count);
                        popupLabel = `<strong>${popupLabel}</strong>`;
                        popupLabel += `<br>${state.subindicator.indicator} (${subindicatorValue.key}): ${countFmt}`;
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

        var childGeographies = Object.entries(data.obj.children).map((childGeography) => {
            var code = childGeography[0];
            var count = childGeography[1];
            var universe = data.subindicators.reduce((el1, el2) => {
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
            var layer = self.layerCache.geoMap[el.code];
            var color = scale(el.val);
            layer.setStyle({fillColor: color});
        })
    };

    overlayBoundaries(areaCode, showChildren = true, zoomNeeded = false) {
        var self = this;
        const boundaryLayers = [];

        self.triggerEvent("layerLoading", self.map);

        self.layerCache.getLayers(areaCode, boundaryLayers, showChildren).then(layers => {
            self.boundaryLayers.clearLayers();

            var secondaryLayers = layers.slice(1).reverse();
            var mainLayer = layers[0];

            secondaryLayers.forEach((layer) => {
                self.layerStyler.setLayerToHoverOnly(layer);
                self.boundaryLayers.addLayer(layer);

            })

            self.layerStyler.setLayerToSelected(mainLayer);
            self.boundaryLayers.addLayer(mainLayer);

            //var alreadyZoomed = false;
            var alreadyZoomed = !zoomNeeded;

            var layerPayload = function (layer) {
                var prop = layer.layer.feature.properties;
                return {
                    mapItId: prop.code,
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
                        console.log('alreadyZoomed : ' + alreadyZoomed)
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
        });

    };
}

/**
 A tree-hash cache for map boundary layers
 Every geograpy node is indexed by level_code
 A node contains the following attributes:
 - layer
 - parent layer
 - code
 */
export class LayerCache {
    constructor(geographyProvider) {
        this.mapit = geographyProvider
        //this.mapit = new MapItGeographyProvider()
        this.geoMap = {};
    };

    hashGeographies(layer) {
        var self = this;
        layer.eachLayer(l => {
            const props = l.feature.properties;
            const code = props.code;
            self.geoMap[code] = l;
        })
    };

    /**
     * Return an array of Leaflet layers to be displayed
     * @param  {[type]}
     * @param  {Function}
     * @return {[type]}
     */
    getLayers(code, layers, showChildren = true) {
        const self = this;
        if (code == null)
            code = this.mapit.defaultGeography;

        if (layers == undefined)
            layers = [];

        let geography = null;

        const promiseGeography = Promise.resolve(code)
            .then(code => {
                return self.mapit.getGeography(code).then(g => {
                    geography = g;
                    return code
                })
            })

        const promiseChildren = Promise.resolve(code)
            .then(code => {
                if (showChildren)
                    return self.mapit.childGeometries(code)
                else
                    return Promise.resolve(geography.geometry);
                //return self.mapit.getGeography(code).then(geo => geo.geometry);
            })

        return Promise.all([promiseGeography, promiseChildren])
            .then(results => {
                const geojson = results[1];
                const layer = L.geoJson(geojson);


                const hasGeometries = layer.getLayers().length > 0;
                self.hashGeographies(layer);
                if (hasGeometries)
                    layers.push(layer);

                return geography.parent
            })
            .then(parent => {
                if (parent != null) {
                    geography = geography.parent;
                    return self.getLayers(geography.code, layers, true);
                } else if (geography._parentId != null) {
                    return self.getLayers(geography._parentId, layers, true);
                }

                return layers;
            })
    }
}
