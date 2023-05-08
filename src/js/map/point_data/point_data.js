import {Component, ThemeStyle, checkIterate, setPopupStyle} from '../../utils';
import {getJSON} from '../../api';
import {stopPropagation} from "leaflet/src/dom/DomEvent";
import {ClusterController} from './cluster_controller'
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import {PointFilter} from "./point_filter";
import xss from 'xss';

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

const POPUP_OFFSET = [20, -20];
const CIRCLE_MARKER_POPUP_OFFSET = [20, 0];

const allowedTags = ['a', 'b', 'em', 'span', 'i', 'div', 'p', 'ul', 'li', 'ol', 'table', 'tr', 'td', 'th'];
const allowedAttributes = ["class", "target", "style", "href"];
const xssOptions = {
    stripIgnoreTag: true,
    onTag: function (tag, html, options) {
        if (allowedTags.indexOf(tag) === -1) {
            return '';
        }
    },
    onTagAttr: function (tag, name, value, isWhiteAttr) {
        if (allowedAttributes.indexOf(name) >= 0) {
            return name + '="' + xss.escapeAttrValue(value) + '"';
        }
    },
    onIgnoreTagAttr: function (tag, name, value, isWhiteAttr) {
        if (name.substr(0, 5) === "data-") {
            return name + '="' + xss.escapeAttrValue(value) + '"';
        }
    }
};

const xssFilter = new xss.FilterXSS(xssOptions);

/**
 * this class creates the point data dialog
 */
export class PointData extends Component {
    constructor(parent, api, _map, profileId, config) {
        super(parent);

        this.api = api;
        this.map = _map;
        this.profileId = profileId;
        this.config = config;

        this.googleMapsButton = null;

        this.activePoints = [];  //the visible points on the map
        this.categoryLayers = {};

        this.clusterController = new ClusterController(this, this.map, config);
        this.enableClustering = this.clusterController.isClusteringEnabled();
        this.clusterLayer = this.genLayer();
        this.clusterController.initClustering();

        this.markers = this.clusterController.markers;

        if (this.enableClustering) {
            this.map.addLayer(this.markers);
        }

        this.initFilter();
        this.prepareDomElements();
    }

    initFilter() {
        this.pointFilter = new PointFilter(this);
        this.pointFilter.filterCallback = (filteredData, selectedSubIndicators) => this.filterPoints(filteredData, selectedSubIndicators);
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
        if (this.enableClustering) {
            const CLUSTER_PANE = 'clusters';
            const CLUSTER_Z_INDEX = 670;    //above the geo labels - below the tooltip layer

            if (!this.map.hasLayer(this.clusterLayer)) {
                this.map.createPane(CLUSTER_PANE);
                this.map.getPane(CLUSTER_PANE).style.zIndex = CLUSTER_Z_INDEX;
                this.map.getPane(CLUSTER_PANE).style.pointerEvents = 'none';
            }

            return L.featureGroup([], {pane: CLUSTER_PANE}).addTo(this.map);
        } else {
            return L.featureGroup([], {pane: 'markerPane'}).addTo(this.map)
        }
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

        self.pointFilter.isVisible = true;
    }

    removeCategoryPoints = (category) => {
        if (!this.enableClustering) {
            let layer = this.categoryLayers[category.id];

            if (layer !== undefined) {
                this.map.removeLayer(layer);
                pointLegend.find(`.${pointLegendItemClsName}[data-id='${category.id}']`).remove();

                this.activePoints = this.activePoints.filter((ap) => {
                    return ap.category.id !== category.id
                })
                this.pointFilter.activePoints = this.activePoints;
            }
        } else {
            let pointsToRemove = this.activePoints.filter((ap) => {
                return ap.category.id === category.id
            });

            let removeMarkers = [];

            checkIterate(pointsToRemove, (p) => {
                removeMarkers.push(p.marker);
            })

            this.activePoints = this.activePoints.filter((ap) => {
                return pointsToRemove.indexOf(ap) < 0;
            })
            this.markers.removeLayers(removeMarkers);
            this.pointFilter.activePoints = this.activePoints;
            pointLegend.find(`.${pointLegendItemClsName}[data-id='${category.id}']`).remove();
        }

        if (pointLegend.find(`.${pointLegendItemClsName}`).length <= 0) {
            this.pointFilter.isVisible = false;
        }
    }

    filterPoints(filterResult, selectedFilter) {
        if (this.enableClustering) {
            this.filterClusteredPoints(filterResult);
        } else {
            this.filteredUnclusteredPoints(filterResult);
        }
    }

    filterClusteredPoints(filterResult) {
        let markers = [];
        if (Object.keys(filterResult).length !== 0) {
            markers = filterResult.map(a => a.marker);
        }

        this.markers.clearLayers();

        this.markers.addLayers(markers);
    }

    filteredUnclusteredPoints(filterResult) {
        let self = this;
        let selectedCategoryIds = [];
        selectedCategoryIds = this.activePoints.map(a => a.category.id);
        selectedCategoryIds = [...new Set(selectedCategoryIds)];

        selectedCategoryIds.forEach((cId) => {
            let categoryLayer = self.categoryLayers[cId];

            let categoryPoints = [];
            if (Object.keys(filterResult).length !== 0) {
                categoryPoints = filterResult.filter((ap) => {
                    return ap.category.id === cId;
                })
            }

            const layerAvailable = categoryPoints.length > 0;
            self.map.removeLayer(categoryLayer);

            if (categoryLayer !== undefined) {
                if (layerAvailable) {
                    self.map.addLayer(categoryLayer);
                }

                let markers = categoryPoints.map(a => a.marker);
                categoryLayer.clearLayers();
                markers.forEach((m) => {
                    categoryLayer.addLayer(m);
                })
            }
        })
    }

    unSelectAllCategories() {
        this.triggerEvent('point_data.all.unselected');
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
        pointLegend.addClass('visible-in-download');
        let color = category.data.theme.color;
        let item = pointLegendItem.cloneNode(true);
        $('.point-legend__text', item).text(category.data.name);
        $('.point-legend__color', item).css('background-color', color);
        $(item).attr('data-id', category.id);
        $('.point-legend__remove', item).on('click', () => {
            $(`.point-mapper__h2[data-id=${category.id}]`).trigger('click');
            if ($('.map-point-legend .point-legend').length <= 0) {
                //all the legend items are removed - remove filters too
                $('.point-filters__header-close').trigger('click');
            }
        })

        pointLegend.append(item);
    }

    /**
     * individual markers
     */
    createMarkers = (points, layer) => {
        let newMarkers = [];
        checkIterate(points.data, point => {
            let marker = this.generateMarker(point.theme.color, point);

            marker.on('click', (e) => {
                this.showMarkerPopup(e, point, points.category, true);
                stopPropagation(e); //prevent map click event
            }).on('mouseover', (e) => {
                if (!this.enableClustering) {
                    e.target.setRadius(this.markerRadius() * 2);
                    e.target.bringToFront();
                }
                this.showMarkerPopup(e, point, points.category);
            }).on('mouseout', (e) => {
                if (!this.enableClustering) {
                    e.target.setRadius(this.markerRadius());
                }
                //hideMarkerPopup() is not needed - autoClose property is sufficient
                //hideMarkerPopup() caused a bug with spiderfied markers
            });

            if (this.enableClustering) {
                newMarkers.push(marker);
            } else {
                layer.addLayer(marker);
            }

            this.activePoints.push({
                marker: marker,
                category: points.category,
                point: point
            });
        })

        if (this.enableClustering) {
            this.markers.addLayers(newMarkers);
        }
        this.pointFilter.activePoints = this.activePoints;
    }

    generateMarker(color, point) {
        let marker;

        if (this.enableClustering) {
            let html = this.generateMarkerHtml(color);

            let divIcon = L.divIcon({
                html: html,
                className: "leaflet-data-marker",
                iconSize: [21, 33],
                iconAnchor: [10.5, 29] // 10.5 => icon width / 2
                                       // 29 => icon height - icon shadow
            });

            marker = L.marker([point.y, point.x],
                {
                    icon: divIcon,
                    color: color,
                    pane: 'clusters',
                    categoryName: point.category.data.name
                });
        } else {
            marker = L.circleMarker([point.y, point.x], {
                color: color,
                radius: this.markerRadius(),
                fill: true,
                fillColor: color,
                fillOpacity: 1,
                pane: 'markerPane'
            })
        }

        return marker;
    }

    validateCoordinates(lat, lon) {
        const latRgx = /^(-?[1-8]?\d(?:\.\d{1,18})?|90(?:\.0{1,18})?)$/;
        const lonRgx = /^(-?(?:1[0-7]|[1-9])?\d(?:\.\d{1,18})?|180(?:\.0{1,18})?)$/;

        const validLat = latRgx.test(lat);
        const validLon = lonRgx.test(lon);
        if (validLat && validLon) {
            return true;
        } else {
            return false;
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
            offset: this.enableClustering ? POPUP_OFFSET : CIRCLE_MARKER_POPUP_OFFSET,
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
        const htmlFields = point.category.data.configuration?.field_type || {};
        point.data.forEach((a, i) => {
            if (a.value !== null
                && (visibleAttributes === null || visibleAttributes.indexOf(a.key) >= 0)
                && Object.prototype.toString.call(a.value) !== '[object Object]'
                && a.value.toString().trim() !== '') {
                let itemRow = rowItem.cloneNode(true);
                $(itemRow).removeClass('last');
                $('.' + labelClsName, itemRow).text(a.key);
                const isKeyHtmlType = htmlFields.hasOwnProperty(a.key) ? htmlFields[a.key] === "html" : false;

                if (isKeyHtmlType) {
                    let htmlText = xssFilter.process(a.value);
                    $('.' + valueClsName, itemRow).html(htmlText);
                } else {
                    $('.' + valueClsName, itemRow).text(a.value);
                }
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
        if (this.enableClustering) {
            return;
        }

        const radius = this.markerRadius();
        Object.values(this.categoryLayers).forEach(layer => {
            layer.eachLayer(point => {
                point.setRadius(radius);
            })
        })
    }
}
