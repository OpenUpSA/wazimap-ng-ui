import {Observable, numFmt, getSelectedBoundary} from '../utils';
import {polygon} from 'leaflet/dist/leaflet-src.esm';
import {LayerStyler} from "./layerstyler";

import {eventForwarder} from 'leaflet-event-forwarder/dist/leaflet-event-forwarder';
import {LevelBasedCalculator} from "./choropleth/level_based_calculator";
import {GeoBasedCalculator} from "./choropleth/geo_based_calculator";
import {Choropleth} from "./choropleth/choropleth";

let ch = null;

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
        this.map.on("zoomend", e => this.triggerEvent("mapZoomed", this.map))
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
            .map('main-map', {zoomControl: this.zoomControlEnabled, preferCanvas: true})
            .setView([coords["lat"], coords["long"]], coords["zoom"])

        L.tileLayer(tileUrl).addTo(map);
        L.control.zoom({position: this.zoomPosition}).addTo(map);
        this.boundaryLayers = L.layerGroup().addTo(map);
        this.configureForwarder(map);

        return map;
    };

    configureForwarder(map) {
        this.myEventForwarder = new L.eventForwarder({
            map: map,
            events: {
                click: true,
                mousemove: true
            },
            // throttle options for mousemove events (same as underscore.js)
            throttleMs: 100,
            throttleOptions: {
                leading: true,
                trailing: false
            }
        });
        this.myEventForwarder.enable();
    }


    /**
     * Handles creating a choropleth when a subindicator is clicked
     * @param  {[type]} data    An object that contains subindictors and obj
     */
    choropleth(subindicator) {
        if (subindicator.obj.children == undefined)
            return;

        let type = 'levelBasedValues';   //todo:get this value from API when it is ready
        this.legendColors = []; //this is used by mapchip too

        let calculations = {
            levelBasedValues: LevelBasedCalculator(subindicator),
            geographyBasedValues: GeoBasedCalculator(subindicator)
        }[type];

        ch = new Choropleth(subindicator, this.layerCache, this.legendColors);
        ch.showChoropleth(calculations);
    };

    resetChoropleth() {
        self = this;
        self.layerStyler.setLayerToSelected(self.mainLayer);
    }

    limitGeoViewSelections = (level) => {
        if (this.config.limitGeoViewSelections) {
            $('nav#w-dropdown-list-0').find('a').show();
            $('nav#w-dropdown-list-0').find('a:nth-child(2)').text('Mainplaces when possible');
            $('#w-dropdown-toggle-0').html($('#w-dropdown-toggle-0').html().toString().replace('Sub-place', 'Mainplace'))

            if (this.config.geoViewTypes.mainplace.indexOf(level) >= 0) {
                $('nav#w-dropdown-list-0').find('a:nth-child(1)').hide();
            } else if (this.config.geoViewTypes.ward.indexOf(level) >= 0) {
                $('nav#w-dropdown-list-0').find('a:nth-child(2)').hide();
            }
        }
    }


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
            selectedBoundary = getSelectedBoundary(level, geometries, this.config);
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
                    if (Object.keys(geometries.children).length > 0) {
                        const prop = el.layer.feature.properties;
                        const areaCode = prop.code;
                        self.triggerEvent("layerClick", layerPayload(el));
                    }
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
