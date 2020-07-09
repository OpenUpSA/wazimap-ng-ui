import {Observable, ThemeStyle, hasElements, checkIterate, setPopupStyle} from '../utils';
import {getJSON} from '../api';
import {count} from "d3-array";
import {stopPropagation} from "leaflet/src/dom/DomEvent";

const url = 'points/themes';
const pointsByThemeUrl = 'points/themes';
const pointsByCategoryUrl = 'points/categories';
const tooltipClsName = 'facility-tooltip';
const tooltipRowClsName = 'facility-tooltip__item';
const tooltipItemsClsName = 'facility-tooltip__items';

let tooltipItem = null;
let tooltipRowItem = null;
let activeMarkers = [];
let activePoints = [];  //the visible points on the map

/**
 * this class creates the point data dialog
 */
export class PointData extends Observable {
    constructor(api, _map, profileId, config) {
        super();

        this.api = api;
        this.map = _map;
        this.profileId = profileId;
        this.config = config;

        this.markerLayer = this.genLayer();
        this.categoryLayers = {};

        this.prepareDomElements();
    }

    prepareDomElements = () => {
        tooltipItem = $('.' + tooltipClsName)[0].cloneNode(true);
        tooltipRowItem = $('.' + tooltipRowClsName)[0].cloneNode(true);
    }

    genLayer() {
        return L.featureGroup([], {pane: 'markerPane'}).addTo(this.map)
    }

    /**
     * this function is called when a category is toggled
     * */

    showCategoryPoint = (category) => {
        const self = this;
        let categoryUrl = `${this.baseUrl}/${pointsByCategoryUrl}/${category.id}/?format=json`
        let layer = this.categoryLayers[category.id];

        if (layer != undefined) {
            this.map.addLayer(layer);
            category.showLoading(false);
            category.showDone(true);
            return;
        } else {
            layer = this.genLayer()
            this.categoryLayers[category.id] = layer;

            this.triggerEvent('loadingCategoryPoints', category);
            return this.getAddressPoints(category)
                .then(data => {
                    data.icon = category.data.theme.icon;
                    self.createMarkers(data, layer);
                    self.map.addLayer(layer);

                    return data;
                })
                .then(data => {
                    // TODO should rather listen for the event
                    category.showLoading(false);
                    category.showDone(true);
                    this.triggerEvent('loadedCategoryPoints', {category: category, points: data});
                    return data;
                });

        }

    }

    removeCategoryPoints = (category) => {
        let layer = this.categoryLayers[category.id];

        if (layer != undefined) {
            this.map.removeLayer(layer);
        }
    }

    /** end of category functions **/

    getAddressPoints(category) {
        const points = [];
        return this.api.loadPoints(this.profileId, category.id).then(data => {
            checkIterate(data.features, feature => {
                const prop = feature.properties;
                const geometry = feature.geometry;

                points.push({
                    x: geometry.coordinates[0],
                    y: geometry.coordinates[1],
                    name: prop.name,
                    category: prop.category,
                    theme: prop.category.theme,
                    data: prop.data,
                    icon: category.theme.icon
                })
            })

            return points;
        })
    }

    markerRadius() {
        return this.map.getZoom() / 4;
    }

    /**
     * individual markers
     */
    createMarkers = (points, layer) => {
        const self = this;

        checkIterate(points, point => {
            //const col = $('.theme-' + point.theme.id).css('color');
            const col = $('.point-mapper__h1_trigger.theme-' + point.theme.id).css('color');
            let marker = L.circleMarker([point.y, point.x], {
                color: col,
                radius: 3,
                fill: true,
                fillColor: col,
                fillOpacity: 1,
                pane: 'markerPane'
            })
            marker.on('click', (e) => {
                this.showMarkerPopup(e, point, true);
                stopPropagation(e); //prevent map click event
            }).on('mouseover', (e) => {
                this.showMarkerPopup(e, point);
            }).on('mouseout', () => {
                this.hideMarkerPopup();
            });
            layer.addLayer(marker);
        })
    }

    showMarkerPopup = (e, point, isClicked = false) => {
        this.map.closePopup();
        const popupContent = this.createPopupContent(point);
        let popup = L.popup({
            autoPan: false,
            autoClose: !isClicked,
            offset: [9, 0],
            closeButton: isClicked
        })

        if (isClicked) {
            popup
                .setLatLng({lat: point.y, lng: point.x})
                .setContent(popupContent)
                .addTo(this.map);
        } else {
            popup
                .setLatLng({lat: point.y, lng: point.x})
                .setContent(popupContent)
                .openOn(this.map);
        }

        setPopupStyle('facility-tooltip');
    }

    hideMarkerPopup = () => {
        this.map.closePopup();
        this.map.map_variables.popup = null;
    }

    createPopupContent = (point) => {
        let item = tooltipItem.cloneNode(true);

        $(item).find('.tooltip__notch').remove();   //leafletjs already creates this

        $('.facility-tooltip__header_name div', item).text(point.name);
        ThemeStyle.replaceChildDivWithIcon($(item).find('.facility-tooltip__header_icon'), point.icon)

        $('.' + tooltipItemsClsName, item).html('');

        let arr = [];
        for (let key in point.data) {
            if (point.data.hasOwnProperty(key)) {
                arr.push({key: key, value: point.data[key]});
            }
        }

        arr.forEach((a, i) => {
            if (Object.prototype.toString.call(a.value) == '[object String]') {
                let itemRow = tooltipRowItem.cloneNode(true);
                $('.tooltip__facility-item_label div', itemRow).text(a.key);
                $('.tooltip__facility-item_value div', itemRow).text(a.value);
                if (i === arr.length - 1) {
                    $(itemRow).addClass('last')
                }

                $('.' + tooltipItemsClsName, item).append(itemRow);
            }
        })

        return $(item).html();
    }

    onMapZoomed(map) {
        const radius = this.markerRadius();
        Object.values(this.categoryLayers).forEach(layer => {
            layer.eachLayer(point => {
                point.setRadius(radius);
            })
        })
    }
}
