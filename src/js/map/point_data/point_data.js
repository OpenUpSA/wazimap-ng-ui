import {Component, ThemeStyle, hasElements, checkIterate, setPopupStyle} from '../../utils';
import {getJSON} from '../../api';
import {count} from "d3-array";
import {stopPropagation} from "leaflet/src/dom/DomEvent";
import {Cluster} from './cluster'
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'

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

        this.googleMapsButton = null;

        this.activePoints = [];  //the visible points on the map
        this.markerLayer = this.genLayer();
        this.categoryLayers = {};
        this.cluster = new Cluster(this, this.map);

        this.enableClustering = this.cluster.isClusteringEnabled();
        this.markers = this.cluster.markers;

        if (this.enableClustering) {
            this.map.addLayer(this.markers);
        }

        this.prepareDomElements();
    }

    prepareDomElements = () => {
        let googleMapsButtonClsName = 'facility-info__view-google-map';

        tooltipItem = $('.' + tooltipClsName)[0].cloneNode(true);
        tooltipRowItem = $('.' + tooltipRowClsName)[0].cloneNode(true);
        facilityRowItem = $('.' + facilityRowClsName)[0].cloneNode(true);
        facilityItem = $('.' + facilityClsName);
        pointLegend = $('.' + pointLegendWrapperClsName);
        pointLegendItem = $('.' + pointLegendItemClsName)[0].cloneNode(true);
        this.googleMapsButton = $('.' + googleMapsButtonClsName);

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

        if (layer != undefined && !this.enableClustering) {
            this.map.addLayer(layer);
            self.showPointLegend(category);
            this.showDone(category)
        } else {
            layer = this.genLayer()
            this.categoryLayers[category.id] = layer;

            this.triggerEvent('loadingCategoryPoints', category);

            const data = await this.getAddressPoints(category);
            const points = {
                category: category,
                data: data
            };
            self.showPointLegend(category);
            self.createMarkers(points, layer);
            self.map.addLayer(layer);
            self.showDone(category);

            self.triggerEvent('loadedCategoryPoints', {category: category, points: data});
        }
    }

    removeCategoryPoints = (category) => {
        if (!this.enableClustering) {
            let layer = this.categoryLayers[category.id];

            if (layer != undefined) {
                this.map.removeLayer(layer);
                pointLegend.find(`.${pointLegendItemClsName}[data-id='${category.data.id}']`).remove();
            }
        } else {
            let pointsToRemove = this.activePoints.filter((ap) => {
                return ap.category.id === category.id
            });

            let removeMarkers = [];

            checkIterate(pointsToRemove, (p) => {
                removeMarkers.push(p.marker);
            })

            this.markers.removeLayers(removeMarkers);
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
    createMarkers = (points, layer) => {
        let col = '';
        let newMarkers = [];
        checkIterate(points.data, point => {
            if (col === '') {
                let themeIndex = point.themeIndex;

                col = $(`.point-mapper__h1_trigger.theme-${themeIndex}:not(.point-mapper__h1--default-closed)`).css('color');
            }

            let html = this.generateMarkerHtml(col);

            let divIcon = L.divIcon({
                html: html,
                className: "leaflet-data-marker",
                iconSize: L.point(25, 25)
            });

            let marker = L.marker([point.y, point.x],
                {
                    icon: divIcon,
                    color: col,
                    categoryName: point.category.data.name
                });

            marker.on('click', (e) => {
                this.showMarkerPopup(e, point, points.category, true);
                stopPropagation(e); //prevent map click event
            }).on('mouseover', (e) => {
                this.showMarkerPopup(e, point, points.category);
            }).on('mouseout', () => {
                this.hideMarkerPopup();
            });

            if (this.enableClustering) {
                this.activePoints.push({
                    marker: marker,
                    category: points.category
                });

                newMarkers.push(marker);
            } else {
                layer.addLayer(marker);
            }
        })

        if (this.enableClustering) {
            this.markers.addLayers(newMarkers);
        }
    }

    generateMarkerHtml(color) {
        let html = `<svg xmlns="http://www.w3.org/2000/svg" width="21" height="33" viewBox="0 0 21 33" fill="none">
                        <g opacity="0.5" filter="url(#filter0_f)">
                            <ellipse cx="10.5" cy="29.5" rx="5.5" ry="0.5" fill="black"/>
                        </g>
                        <path d="M21 10.5C21 16.299 16.299 21 10.5 21C4.70101 21 0 16.299 0 10.5C0 4.70101 4.70101 0 10.5 0C16.299 0 21 4.70101 21 10.5Z" fill="white"/>
                        <path d="M10.5 16.9991L16.4999 18.9999L10.5 28.9988L4.50012 18.9999L10.5 16.9991Z" fill="white"/>
                        <circle cx="10.5" cy="10.5" r="8.5" fill="${color}"/>
                        <defs>
                            <filter id="filter0_f" x="2" y="26" width="17" height="7" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                                <feGaussianBlur stdDeviation="1.5" result="effect1_foregroundBlur"/>
                            </filter>
                        </defs>
                    </svg>`;

        return html;
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
        $('.facility-info__print').off('click').on('click', () => {
            window.print();
        });
        this.appendPointData(point, facilityItem, facilityRowItem, facilityItemsClsName, 'facility-info__item_label', 'facility-info__item_value');

        let gMapsUrl = `https://www.google.com/maps/search/?api=1&query=${point.y},${point.x}`;
        this.googleMapsButton.removeClass('hidden');
        this.googleMapsButton.attr('href', gMapsUrl);
        this.googleMapsButton.attr('target', '_blank');

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
