import {Component, ThemeStyle, hasElements, checkIterate, setPopupStyle} from '../utils';
import {getJSON} from '../api';
import {count} from "d3-array";
import {stopPropagation} from "leaflet/src/dom/DomEvent";
import 'overlapping-marker-spiderfier-leaflet/build/oms';

const url = 'points/themes';
const pointsByThemeUrl = 'points/themes';
const pointsByCategoryUrl = 'points/categories';
const tooltipClsName = 'facility-tooltip';
const tooltipRowClsName = 'facility-tooltip__item';
const tooltipItemsClsName = 'facility-tooltip__items';

const facilityClsName = 'facility-info';
const facilityRowClsName = 'facility-info__item';
const facilityItemsClsName = 'facility-info__items';

const pointLegendWrapperClsName = 'map-point-legend';
const pointLegendItemClsName = 'point-legend';

let pointLegend = null;
let pointLegendItem = null;

let tooltipItem = null;
let tooltipRowItem = null;

let facilityItem = null;
let facilityRowItem = null;

let activeMarkers = [];
let activePoints = [];  //the visible points on the map

const POPUP_OFFSET = [20, 0];

/**
 * this class creates the point data dialog
 */
export class PointData extends Component {
    constructor(parent, api, _map, profileId) {
        super(parent);

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
        facilityRowItem = $('.' + facilityRowClsName)[0].cloneNode(true);
        facilityItem = $('.' + facilityClsName);
        pointLegend = $('.' + pointLegendWrapperClsName);
        pointLegendItem = $('.' + pointLegendItemClsName)[0].cloneNode(true);

        $(pointLegend).empty();
        $('.facility-info__close').on('click', () => this.hideInfoWindows());
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
            self.showPointLegend(category);
            this.showDone(category)
        } else {
            layer = this.genLayer()
            this.categoryLayers[category.id] = layer;

            this.triggerEvent('loadingCategoryPoints', category);

            const data = await this.getAddressPoints(category);
            self.showPointLegend(category);
            self.createMarkers(data, category.data, layer);
            self.map.addLayer(layer);
            self.showDone(category);

            self.triggerEvent('loadedCategoryPoints', {category: category, points: data});

        }
    }

    removeCategoryPoints = (category) => {
        let layer = this.categoryLayers[category.id];

        if (layer != undefined) {
            this.map.removeLayer(layer);
            pointLegend.find(`.${pointLegendItemClsName}[data-id='${category.data.id}']`).remove();
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

    showPointLegend = (category) => {
        pointLegend.removeClass('hidden');
        let color = $(`.theme-${category.themeIndex}`).css('color');
        let item = pointLegendItem.cloneNode(true);
        $('.point-legend__text', item).text(category.data.name);
        $('.point-legend__color', item).css('background-color', color);
        $(item).attr('data-id', category.data.id);
        $('.point-legend__remove', item).on('click', () => {
            $(`.point-mapper__h2[data-id=${category.data.id}]`).trigger('click');
        })

        pointLegend.append(item);
    }

    /**
     * individual markers
     */
    createMarkers = (points, categoryData, layer) => {
        const self = this;
        let col = '';
        let oms = new OverlappingMarkerSpiderfier(self.map, {
            keepSpiderfied: true
        });
        oms.addListener('click', function (m) {
            self.showMarkerPopup(m, m.options.point, categoryData, true);
        });

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
                pane: 'markerPane',
                point: point
            })
            marker.on('click', (e) => {
                stopPropagation(e); //prevent map click event
            }).on('mouseover', (e) => {
                this.showMarkerPopup(e, point, categoryData);
            }).on('mouseout', () => {
                this.hideMarkerPopup();
            });
            layer.addLayer(marker);
            oms.addMarker(marker);
        })
    }

    showMarkerPopup = (e, point, categoryData, isClicked = false) => {
        this.map.closePopup();
        const popupContent = this.createPopupContent(point, categoryData.visible_tooltip_attributes);
        let popup = L.popup({
            autoPan: false,
            autoClose: !isClicked,
            offset: POPUP_OFFSET,
            closeButton: isClicked
        })

        const eventLabel = `${point.theme.name} | ${point.category.name} | ${point.name}`;

        if (isClicked) {
            popup
                .setLatLng({lat: point.y, lng: point.x})
                .setContent(popupContent)
                .addTo(this.map)
                .on('remove', () => {
                    this.hideInfoWindows();
                });
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

    hideInfoWindows = () => {
        this.hideFacilityModal();
        $('a.leaflet-popup-close-button')[0].click()
    }

    hideMarkerPopup = () => {
        this.map.closePopup();
        this.map.map_variables.popup = null;
    }

    createPopupContent = (point, visibleAttributes) => {
        let item = tooltipItem.cloneNode(true);

        $(item).find('.tooltip__notch').remove();   //leafletjs already creates this

        const nameContainer = $('.facility-tooltip__header_name', item);
        if (point.url != null)
            nameContainer.html(`<a href="${point.url}" target="_blank">${point.name}</a>`)
        else
            nameContainer.text(point.name);
        ThemeStyle.replaceChildDivWithIcon($(item).find('.facility-tooltip__header_icon'), point.icon)

        $('.' + tooltipItemsClsName, item).html('');

        if (typeof visibleAttributes === 'undefined') {
            visibleAttributes = [];
        }

        this.appendPointData(point, item, tooltipRowItem, tooltipItemsClsName, 'tooltip__facility-item_label', 'tooltip__facility-item_value', visibleAttributes);

        if (point.image != null)
            $('.' + tooltipItemsClsName, item).append(`<img src="${point.image}"/>`);


        $('.facility-tooltip__open-modal', item).on('click', () => {
            this.showFacilityModal(point);
        })

        return item;
    }

    showFacilityModal = (point) => {
        $('.facility-info__title').text(point.name);
        this.appendPointData(point, facilityItem, facilityRowItem, facilityItemsClsName, 'facility-info__item_label', 'facility-info__item_value');

        $('.facility-info').css('display', 'flex');
    }

    appendPointData = (point, item, rowItem, itemsClsName, labelClsName, valueClsName, visibleAttributes = null) => {
        $('.' + itemsClsName, item).empty();
        point.data.forEach((a, i) => {
            if (Object.prototype.toString.call(a.value) !== '[object Object]' && (visibleAttributes === null || visibleAttributes.indexOf(a.key) >= 0)) {
                let itemRow = rowItem.cloneNode(true);
                $(itemRow).removeClass('last');
                $('.' + labelClsName, itemRow).text(a.key);
                $('.' + valueClsName, itemRow).text(a.value);
                if (i === point.data.length - 1) {
                    $(itemRow).addClass('last')
                }

                $('.' + itemsClsName, item).append(itemRow);
            }
        })
    }

    hideFacilityModal = () => {
        $('.facility-info').hide();
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
