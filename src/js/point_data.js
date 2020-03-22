import {getJSON, Observable, ThemeStyle, hasElements, checkIterate} from './utils';
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

        this.markerLayer = L.featureGroup([], {pane: 'markerPane'}).addTo(this.map)


    }

    /**
     * this function is called when a category is toggled
     * */

    showCategoryPoint = (category) => {
        let categoryUrl = `${this.baseUrl}/${pointsByCategoryUrl}/${category.id}/?format=json`
        this.triggerEvent('loadingCategoryPoints', category);
        return this.getAddressPoints(categoryUrl).then(data => {
            // TODO should rather listen for the event
            category.showLoading(false);
            category.showDone(true);
            this.triggerEvent('loadedCategoryPoints', {category: category, points: data});

        });
    }

    removeCategoryPoints = (category) => {
        activePoints = activePoints.filter(item => {
            return item.category.id !== category.id
        });

        this.showPointsOnMap();
    }
    /** end of category functions **/

    showThemePoints = (theme) => {
        //need to remove for in case its already showing some from selected item
        this.removeThemePoints(theme);
        let themeUrl = `${this.baseUrl}/${pointsByThemeUrl}/${theme.id}/`;

        return this.getAddressPoints(themeUrl)
    }

    removeThemePoints = (theme) => {
        activePoints = activePoints.filter((item) => {
            return item.theme.id !== theme.id
        });

        this.showPointsOnMap();
    }
    /** end of theme functions **/

    getAddressPoints(requestUrl) {
        return getJSON(requestUrl).then(data => {
            checkIterate(data.features, feature => {
                const prop = feature.properties;
                const geometry = feature.geometry;

                activePoints.push({
                    x: geometry.coordinates[0],
                    y: geometry.coordinates[1],
                    name: prop.data.Name,
                    category: prop.category,
                    theme: prop.category.theme,
                    data: prop.data
                })

            })

            this.showPointsOnMap();
            return data;
        })
    }

    /**
     * individual markers
     */
    showPointsOnMap = () => {
        for (let i = 0; i < activeMarkers.length; i++) {
            activeMarkers[i].remove();
        }

        let renderer = L.svg({padding: 0.5, pane: 'markerPane'});
        checkIterate(activePoints, point => {
            console.log('.active-' + point.theme.id)
            let marker = L.circleMarker([point.y, point.x], {
                renderer: renderer,
                color: $('._' + point.theme.id).css('color'),
                radius: 1,
            })
            //marker.bindTooltip(point.name);
            marker.bindPopup(
                `<div><strong>Name: ${point.name}</strong></div>`,
                {autoClose: false}
            );
            this.markerLayer.addLayer(marker)

            activeMarkers.push(marker);
        })
    }
}
