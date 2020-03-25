import {getJSON, Observable, ThemeStyle, hasElements, checkIterate} from '../utils';
import {count} from "d3-array";



const url = 'points/themes';
const pointsByThemeUrl = 'points/themes';
const pointsByCategoryUrl = 'points/categories';

let activeMarkers = [];
let activePoints = [];  //the visible points on the map

/**
 * this class creates the point data dialog
 */
export class PointData extends Observable {
    constructor(baseUrl, _map, profileId, config) {
        super();

        this.baseUrl = baseUrl;
        this.map = _map;
        this.profileId = profileId;
        this.config = config;

        this.markerLayer = this.genLayer();
        this.categoryLayers = {}
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
            return this.getAddressPoints(categoryUrl)
                .then(data => {
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

    showThemePoints = (theme) => {
        checkIterate(theme.categories, category => showCategoryPoint(category))
    }

    removeThemePoints = (theme) => {
        checkIterate(theme.categories, category => removeCategoryPoints(category))
    }
    /** end of theme functions **/

    getAddressPoints(requestUrl) {
        const points = [];
        return getJSON(requestUrl).then(data => {
            checkIterate(data.features, feature => {
                const prop = feature.properties;
                const geometry = feature.geometry;

                points.push({
                    x: geometry.coordinates[0],
                    y: geometry.coordinates[1],
                    name: prop.name,
                    category: prop.category,
                    theme: prop.category.theme,
                    data: prop.data
                })
            })

            return points;
        })
    }

    markerRadius() {
        return this.map.getZoom() / 2;
    }

    /**
     * individual markers
     */
    createMarkers = (points, layer) => {
        let renderer = L.canvas({padding: 0.5, pane: 'markerPane'});
        const self =  this;

        checkIterate(points, point => {
            const col = $('._' + point.theme.id).css('color');
            let marker = L.circleMarker([point.y, point.x], {
                renderer: renderer,
                color: col,
                radius: self.markerRadius(),
                fill: true,
                fillColor: col,
                fillOpacity: 1
            })
            //marker.bindTooltip(point.name);
            marker.bindPopup(
                `<div><strong>Name: ${point.name}</strong></div>`,
                {autoClose: false}
            );
            layer.addLayer(marker)
        })
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
