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
    constructor(api, _map, profileId) {
        super();

        this.api = api;
        this.map = _map;
        this.profileId = profileId;

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

    showLoading(category) {
        category.showLoading(true);
        category.showDone(false);
    }

    showDone(category) {
        category.showLoading(false);
        category.showDone(true);
    }

    /**
     * this function is called when a category is toggled
     * */

    async showCategoryPoint(category) {

        const self = this;
        let layer = this.categoryLayers[category.id];

        if (layer != undefined) {
            this.map.addLayer(layer);
            this.showDone(category)
        } else {
            layer = this.genLayer()
            this.categoryLayers[category.id] = layer;

            this.triggerEvent('loadingCategoryPoints', category);

            const data = await this.getAddressPoints(category);
            self.createMarkers(data, layer);
            self.map.addLayer(layer);
            self.showDone(category);

            self.triggerEvent('loadedCategoryPoints', {category: category, points: data});

        }
    }

    removeCategoryPoints = (category) => {
        let layer = this.categoryLayers[category.id];

        if (layer != undefined) {
            this.map.removeLayer(layer);
        }
    }

    /** end of category functions **/

    async getAddressPoints(category) {
        const points = [];
        const data = await this.api.loadPoints(this.profileId, category.id)
        checkIterate(data.features, feature => {
            const prop = feature.properties;
            const geometry = feature.geometry;

            points.push({
                x: geometry.coordinates[0],
                y: geometry.coordinates[1],
                name: prop.name,
                category: category,
                theme: category.theme,
                themeIndex: category.themeIndex,
                data: prop.data,
                image: prop.image,
                url: prop.url,
                icon: category.data.theme.icon
            })
        })

        return points;
    }

    markerRadius() {
        return this.map.getZoom() / 2;
    }

    /**
     * individual markers
     */
    createMarkers = (points, layer) => {
        const self = this;
        let col = '';

        checkIterate(points, point => {
            if (col === '') {
                //to get the color add "theme-@index" class to the trigger div. this way we can use css('color') function
                let themeIndex = point.themeIndex;
                let tempElement = $(`.theme-${themeIndex}`)[0];
                tempElement = tempElement.closest('div.point-mapper__h1');
                tempElement = $(tempElement).find('.point-mapper__h1_trigger');

                //if tempElement already has theme-@index class, dont remove it
                let removeClass = !$(tempElement).hasClass('theme-' + themeIndex);

                $(tempElement).addClass('theme-' + themeIndex);
                col = $(tempElement).css('color');
                if (removeClass) {
                    $(tempElement).removeClass('theme-' + point.theme.id);
                }
            }

            let marker = L.circleMarker([point.y, point.x], {
                color: col,
                radius: self.markerRadius(),
                fill: true,
                fillColor: col,
                fillOpacity: 1,
                pane: 'markerPane'
            })
            marker.on('click', (e) => {
                this.showMarkerPopup(e, point, true);
                stopPropagation(e); //prevent map click event
            }).on('mouseover', (e) => {
                e.target.setRadius(self.markerRadius() * 2);
                e.target.bringToFront();
                this.showMarkerPopup(e, point);
            }).on('mouseout', (e) => {
                e.target.setRadius(self.markerRadius());
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

        const eventLabel = `${point.theme.name} | ${point.category.name} | ${point.name}`;

        if (isClicked) {
            popup
                .setLatLng({lat: point.y, lng: point.x})
                .setContent(popupContent)
                .addTo(this.map);
            this.triggerEvent('point_data.load_popup.clicked', eventLabel);
        } else {
            popup
                .setLatLng({lat: point.y, lng: point.x})
                .setContent(popupContent)
                .openOn(this.map);
            this.triggerEvent('point_data.load_popup.hovered', eventLabel);
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

        const nameContainer = $('.facility-tooltip__header_name div', item);
        if (point.url != null)
            nameContainer.html(`<a href="${point.url}" target="_blank">${point.name}</a>`)
        else
            nameContainer.text(point.name);
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
        if (point.image != null)
            $('.' + tooltipItemsClsName, item).append(`<img src="${point.image}"/>`);

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
