import {Observable} from '../utils';
import {polygon} from 'leaflet/dist/leaflet-src.esm';
import {LayerStyler} from './layerstyler';
import {eventForwarder} from 'leaflet-event-forwarder/dist/leaflet-event-forwarder';
import {Choropleth} from './choropleth/choropleth';
import {MapLocker} from './maplocker';
import {SubindicatorFilter} from "../profile/subindicator_filter";


export class MapControl extends Observable {
    constructor(config, zoomToPosition = () => true) {
        super();

        this.config = config;
        this.api = config.api;
        this.zoomToPosition = zoomToPosition;

        const coords = config.map.defaultCoordinates;

        this.zoomEnabled = config.map.zoomEnabled;
        this.zoomPosition = config.map.zoomPosition;
        this.boundaryLayers = null;
        this.mainLayer = null;
        this.layerCache = {};
        this.choroplethData = [];

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

        this.registerEvents();

        this.choropleth = new Choropleth(this.layerCache, this.layerStyler, config.map.choropleth);
    };

    registerEvents() {
        this.map.on("zoomend", e => this.onZoomChanged(e));
        this.map.on("zoomend", e => this.triggerEvent("map.zoomed", this.map))
    }

    enableZoom(enabled) {
        this.zoomEnabled = enabled;
    }

    onZoomChanged(e) {
        // Zoom changed not currently implemented
        return
    }

    // Leaflet
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

        if (mapOptions.leafletOptions.preferCanvas)
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

    async loadSubindicatorData(geo) {
        this.triggerEvent("map.choropleth.loading");

        let response;
        let savedObj = this.choroplethData.filter((x) => {
            return x.geography === geo
        })[0];

        if (savedObj !== null && typeof savedObj !== 'undefined') {
            response = savedObj.data;
        } else {
            response = await this.api.loadChoroplethData(this.config.profile, geo, 1);
            this.choroplethData.push({
                'geography': geo,
                'data': response
            });
        }

        return response;
    }

    /**
     * Handles creating a choropleth when a subindicator is clicked
     * @param  {[type]} data    An object that contains subindictors and obj
     */
    handleChoropleth(data, method, selectedSubindicator, indicatorTitle, showMapchip) {
        const args = {
            data: data,
            selectedSubindicator: selectedSubindicator,
            indicatorTitle: indicatorTitle,
            showMapchip: showMapchip
        }

        this.triggerEvent("map.choropleth.loaded", args);

        this.displayChoropleth(data.child_data, data.metadata.primary_group, method, selectedSubindicator);
    };

    displayChoropleth(childData, primaryGroup, method, selectedSubindicator) {
        const calculator = this.choropleth.getCalculator(method);

        const calculation = calculator.calculate(childData, primaryGroup, selectedSubindicator);

        const values = calculation.map(el => el.val);

        this.choropleth.showChoropleth(calculation, false);
        const intervals = this.choropleth.getIntervals(values);
        const formattedIntervals = intervals.map(el => calculator.format(el))

        this.triggerEvent("map.choropleth.display", {
            data: calculation,
            colors: this.choropleth.legendColors,
            intervals: formattedIntervals
        })
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


    getSelectedBoundary(level, geometries, config) {
        let selectedBoundary = null;

        const preferredChildren = config.preferredChildren[level];
        if (preferredChildren == null)
            return null;

        const availableLevels = preferredChildren.filter(level => geometries.children[level] != undefined)

        if (availableLevels.length > 0) {
            const preferredLevel = availableLevels[0];
            return geometries.children[preferredLevel]
        }

        return null;
    }

    zoomToLayer(layer) {
        if (this.zoomToPosition()) {
            this.map.flyToBounds(layer.getBounds(), {
                animate: true,
                duration: 0.5 // in seconds
            });
        }
    }


    overlayBoundaries(geography, geometries, zoomNeeded = false) {
        const self = this;
        const level = geography.level;
        const preferredChildren = this.config.preferredChildren[level];
        const parentBoundaries = geometries.parents;

        let selectedBoundary;
        let parentBoundary;

        this.map.map_variables.currentLevel = level;
        this.map.map_variables.isLoading = false;

        this.limitGeoViewSelections(level);
        self.triggerEvent("map.layer.loading", geography);

        selectedBoundary = this.getSelectedBoundary(level, geometries, this.config);
        parentBoundary = geometries.boundary;

        const noChildren = selectedBoundary == null;
        if (noChildren)
            selectedBoundary = parentBoundary;

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

        const secondaryLayers = layers.slice(1);
        self.mainLayer = layers[0];

        secondaryLayers.forEach((layer) => {
            self.layerStyler.setLayerToHoverOnly(layer);
            self.boundaryLayers.addLayer(layer);

        })

        self.layerStyler.setLayerToSelected(self.mainLayer);
        self.boundaryLayers.addLayer(self.mainLayer);

        let alreadyZoomed = false;

        const layerPayload = function (layer) {
            var prop = layer.layer.feature.properties;
            return {
                areaCode: prop.code,
                layer: layer.layer,
                element: layer,
                properties: prop,
                maplocker: self.maplocker,
                mapControl: self
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
                    self.triggerEvent("layer.mouse.over", layerPayload(el));
                })
                .on("mouseout", (el) => {
                    self.triggerEvent("layer.mouse.out", layerPayload(el));
                })
                .on("mousemove", (el) => {
                    self.triggerEvent("layer.mouse.move", {
                        layer: layerPayload(el),
                        popup: this.map.map_variables.popup
                    });
                })
                .addTo(self.map);

            if (!alreadyZoomed) {
                try {
                    self.zoomToLayer(layer)
                    alreadyZoomed = true;
                } catch (err) {
                    console.log("Error zooming: " + err);
                }
            }
        })

        self.triggerEvent("map.layer.loaded", {geography: geography, mapControl: this});
    };
}
