import {Observable, numFmt, getSelectedBoundary} from '../utils';
import {polygon} from 'leaflet/dist/leaflet-src.esm';
import {LayerStyler} from './layerstyler';

import {eventForwarder} from 'leaflet-event-forwarder/dist/leaflet-event-forwarder';
import {SubindicatorCalculator} from './choropleth/subindicator_calculator';
import {SiblingCalculator} from './choropleth/sibling_calculator';
import {Choropleth} from './choropleth/choropleth';
import {MapLocker} from './maplocker';
import {SubindicatorFilter} from "../profile/subindicator_filter";


export class MapControl extends Observable {
    constructor(config) {
        super();

        this.config = config;

        const coords = config.map.defaultCoordinates;

        this.zoomEnabled = config.map.zoomEnabled;
        this.zoomPosition = config.map.zoomPosition;
        this.boundaryLayers = null;
        this.mainLayer = null;

        this.layerStyler = new LayerStyler(this.config.layerStyles);
        this.maplocker = new MapLocker();

        this.map = this.configureMap(coords, config.map);
        this.map.map_variables = {
            tooltipClsName: '.map-tooltip',
            tooltipItem: null,
            popup: null,
            hoverAreaCode: null,
            hoverAreaLevel: null,
            currentLevel: null,
            children: [],
            isLoading: false
        };

        this.layerCache = {};
        this.map.on("zoomend", e => this.onZoomChanged(e));
        this.map.on("zoomend", e => this.triggerEvent("mapZoomed", this.map))

        this.choropleth = new Choropleth(this.layerCache, this.layerStyler, config.map.choropleth);
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

    configureMap(coords, mapOptions) {

        const map = L
            .map('main-map', mapOptions.leafletOptions)
            .setView([coords["lat"], coords["long"]], coords["zoom"])

        mapOptions.tileLayers.forEach(layer => {
            const pane = layer.pane;
            map.createPane(pane)
            map.getPane(pane).style.zIndex = layer.zIndex;
            map.getPane(pane).style.pointerEvents = 'none';

            L.tileLayer(layer.url, {pane: pane}).addTo(map).addTo(map);
        })

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
    handleChoropleth(subindicator, method) {
        if (subindicator.children == undefined)
            return;

        this.displayChoropleth(subindicator.children, subindicator.subindicatorArr, method);
    };

    displayChoropleth(data, subindicatorArr, method) {
        let calculationFunc = {
            subindicator: SubindicatorCalculator,
            sibling: SiblingCalculator
        }[method];

        if (calculationFunc == undefined)
            calculationFunc = SubindicatorCalculator

        const args = {
            data: data,
            subindicatorArr: subindicatorArr
        }

        const calculation = calculationFunc(args);
        const values = calculation.map(el => el.val);

        this.choropleth.showChoropleth(calculation);
        const intervals = this.choropleth.getIntervals(values);

        this.triggerEvent("choropleth", {
            data: calculation,
            colors: this.choropleth.legendColors,
            intervals: intervals
        })
    }

    resetChoropleth() {
        this.choropleth.reset();
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
        this.map.map_variables.isLoading = false;

        this.limitGeoViewSelections(level);

        self.triggerEvent("layerLoading", this);
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
                maplocker: self.maplocker
            }
        }

        layers.forEach(layer => {
            layer
                .off("click")
                .on("click", el => {
                    if (!this.map.map_variables.isLoading && (Object.values(geometries.children).length > 0 || el.layer.feature.properties.code !== geography.code)) {
                        /**
                         * (Object.values(geometries.children).length > 0 || el.layer.feature.properties.code !== geography.code) -> check if the current geo has children
                         * or user clicked some other geo
                         */

                        this.map.map_variables.isLoading = true;
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

        self.triggerEvent("layerLoadingDone", self);
    };
}
