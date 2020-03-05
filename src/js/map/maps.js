import {interpolateBlues as d3interpolateBlues} from 'd3-scale-chromatic';
import {scaleSequential as d3scaleSequential, scaleLinear} from 'd3-scale';
import {min as d3min, max as d3max} from 'd3-array';
import {Observable, numFmt} from '../utils';
import {polygon} from "leaflet/dist/leaflet-src.esm";

const legendCount = 5;

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
    constructor(config) {
        super();

        this.config = config;

        const coords = config.map.defaultCoordinates;
        const tileUrl = config.map.tileUrl;

        this.zoomControlEnabled = config.map.zoomControlEnabled;
        this.zoomEnabled = config.map.zoomEnabled;
        this.zoomPosition = config.map.zoomPosition;
        this.boundaryLayers = null;
        this.mainLayer = null;
        this.legendColors = [];

        this.layerStyler = new LayerStyler();

        this.map = this.configureMap(coords, tileUrl);
        this.map.map_variables = {
            tooltipClsName: '.content__map_tooltip',
            tooltipItem: null,
            popup: null,
            hoverAreaCode: null,
            hoverAreaLevel: null,
            currentLevel: null,
            children: []
        };
        this.layerCache = {};
        this.map.on("zoomend", e => this.onZoomChanged(e));
    };

    enableZoom(enabled) {
        this.zoomEnabled = enabled;
    }

    onZoomChanged(e) {
        if (!this.zoomEnabled)
            return;

        if (e.sourceTarget._popup === null || typeof e.sourceTarget._popup === 'undefined') {
            return;
        }

        let area = e.sourceTarget._popup._content;
        let zoomLvl = e.sourceTarget._zoom;
        let areaCode = this.map.map_variables.hoverAreaCode;
        let level = this.map.map_variables.hoverAreaLevel;

        const hash = decodeURI(window.location.hash);
        let parts = hash.split(":")

        if (zoomLvl < 7) {
            window.location.hash = "";
        } else if (zoomLvl >= 11 && level === this.config.geographyLevels.subplace) {
            window.location.hash = "#geo:" + areaCode;
        } else if (zoomLvl >= 10 && level === this.config.geographyLevels.mainplace) {
            window.location.hash = "#geo:" + areaCode;
        } else if (zoomLvl >= 9 && level === this.config.geographyLevels.municipality) {
            window.location.hash = "#geo:" + areaCode;
        } else if (zoomLvl >= 8 && level === this.config.geographyLevels.district) {
            window.location.hash = "#geo:" + areaCode;
        } else if (zoomLvl >= 7 && level === this.config.geographyLevels.province) {
            window.location.hash = "#geo:" + areaCode;
        }
    }

    /**
     * Resize the map according to the size of the container
     * Add a delay in case the container is resizing using an animatio
     * in order to wait for the animation to end.
     * @return {[type]} [description]
     */
    onSizeUpdate() {
        setTimeout(() => {
            this.map.invalidateSize(true);
        }, 500);
    }

    configureMap(coords, tileUrl) {

        const map = L
            .map('main-map', {zoomControl: this.zoomControlEnabled})
            .setView([coords["lat"], coords["long"]], coords["zoom"])

        L.tileLayer(tileUrl).addTo(map);
        L.control.zoom({position: this.zoomPosition}).addTo(map);
        this.boundaryLayers = L.layerGroup().addTo(map);

        return map;
    };

    /**
     * Handles creating a choropleth when a subindicator is clicked
     * @param  {[type]} data    An object that contains subindictors and obj
     */
    choropleth(subindicator) {
        const self = this
        if (subindicator.obj.children == undefined)
            return;

        const childCodes = Object.keys(subindicator.obj.children);

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

        const childGeographies = Object.entries(subindicator.obj.children).map(childGeography => {
            const code = childGeography[0];
            const count = childGeography[1];
            const universe = subindicator.subindicators.reduce((el1, el2) => {
                if (el2.children != undefined && el2.children[code] != undefined)
                    return el1 + el2.children[code];
            }, 0)
            const val = count / universe;
            return {code: code, val: val};
        })

        const values = childGeographies.map(el => el.val);
        const scale = d3scaleSequential(d3interpolateBlues).domain([d3min(values) * 0.9, d3max(values) * 1.1])

        //const legendScale = d3scaleSequential(d3interpolateBlues).domain([0,100])

        let legendPercentages = scaleLinear()
            .domain([1, legendCount])
            .nice()
            .range([d3min(values) * 0.9, d3max(values) * 1.1]);

        this.legendColors = [];

        let tick = (d3max(values) * 1.1 - d3min(values) * 0.9) / (legendCount - 1);
        let startPoint = d3min(values) * 0.9;
        for (let i = 1; i <= legendCount; i++) {
            let percentage = 0;
            if ((((i - 1) * tick + startPoint) * 100) > 100) {
                percentage = 100;
                i = legendCount;
            } else {
                percentage = (((i - 1) * tick + startPoint) * 100).toFixed(1);
            }
            this.legendColors.push({
                percentage: percentage,
                fillColor: scale(legendPercentages(i))
            });
        }

        resetLayers(childCodes);

        childGeographies.forEach((el) => {
            const layer = self.layerCache[el.code];
            if (layer != undefined) {
                const color = scale(el.val);
                layer.setStyle({fillColor: color});
                layer.feature.properties.percentage = el.val;
            }
        })
    };

    resetChoropleth() {
        self = this;
        self.layerStyler.setLayerToSelected(self.mainLayer);
    }

    limitGeoViewSelections = (level) => {
        $('nav#w-dropdown-list-0').find('a').show();
        $('nav#w-dropdown-list-0').find('a:nth-child(2)').text('Mainplaces when possible');
        $('#w-dropdown-toggle-0').html($('#w-dropdown-toggle-0').html().toString().replace('Sub-place', 'Mainplace'))

        if (this.config.geoViewTypes.mainplace.indexOf(level) >= 0) {
            $('nav#w-dropdown-list-0').find('a:nth-child(1)').hide();
        } else if (this.config.geoViewTypes.ward.indexOf(level) >= 0) {
            $('nav#w-dropdown-list-0').find('a:nth-child(2)').hide();
        }
    }

    isMarkerInsidePolygon = (marker, poly) => {
        let polyPoints = poly.getLatLngs()[0][0];
        let x = marker.lng, y = marker.lat;

        let inside = false;
        for (let i = 0, j = polyPoints.length - 1; i < polyPoints.length; j = i++) {
            let xi = polyPoints[i].lat, yi = polyPoints[i].lng;
            let xj = polyPoints[j].lat, yj = polyPoints[j].lng;

            let intersect = ((yi > y) != (yj > y))
                && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }

        return inside;
    };

    overlayBoundaries(geography, geometries, zoomNeeded = false) {
        const self = this;
        const level = geography.level;
        const preferredChildren = this.config.preferredChildren[level];
        let selectedBoundary;
        const parentBoundaries = geometries.parents;

        this.map.map_variables.currentLevel = level;

        this.limitGeoViewSelections(level);

        self.triggerEvent("layerLoading", self.map);
        if (Object.values(geometries.children).length == 0) {
            selectedBoundary = geometries.boundary;
        } else {
            preferredChildren.forEach((preferredChild, i) => {
                if (i === 0) {
                    selectedBoundary = geometries.children[preferredChild];
                } else {
                    let secondarySelectedBoundary = geometries.children[preferredChild];

                    if (typeof secondarySelectedBoundary !== 'undefined' && secondarySelectedBoundary !== null) {
                        secondarySelectedBoundary.features.forEach((feature) => {
                            let alreadyContained = false;
                            selectedBoundary.features.forEach(sb => {
                                if (sb.properties.code === feature.properties.code) {
                                    alreadyContained = true;
                                }
                            })

                            if (!alreadyContained) {
                                selectedBoundary.features.push(feature);
                            }
                        })
                    }
                }
            })
        }

        const layers = [selectedBoundary, ...parentBoundaries].map(l => {
            const leafletLayer = L.geoJson(l);
            leafletLayer.eachLayer(l => {
                let code = l.feature.properties.code;
                self.layerCache[code] = l;
            })
            self.layerCache[geography.code] = leafletLayer;

            return leafletLayer;
        });

        this.map.map_variables.children = [];

        selectedBoundary.features.map((item, i) => {
            const l = L.geoJSON(item);
            let center = l.getBounds().getCenter();
            if (!this.isMarkerInsidePolygon(center, L.polygon(item.geometry.coordinates))) {
                center = {
                    lng: item.geometry.coordinates[0][0].reduce((total, next) => total + next[0], 0) / (item.geometry.coordinates[0][0].length),
                    lat: item.geometry.coordinates[0][0].reduce((total, next) => total + next[1], 0) / (item.geometry.coordinates[0][0].length)
                }
            }
            let x = center.lng
            let y = center.lat
            this.map.map_variables.children.push({
                name: item.properties.name,
                code: item.properties.code,
                center: [x, y],
                categories: [],
                themes:item.properties.themes
            })
        })

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

        var layerPayload = function (layer) {
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
                .on("mousemove", (el) => {
                    self.triggerEvent("layerMouseMove", {layer: layerPayload(el), popup: this.map.map_variables.popup});
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
