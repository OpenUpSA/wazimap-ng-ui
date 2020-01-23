import {getJSON, Observable} from './utils';
import 'leaflet.markercluster/dist/leaflet.markercluster'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'


const url = 'https://wazimap-ng.openup.org.za/api/v1/points/themes/';
const pointsByThemeUrl = 'https://wazimap-ng.openup.org.za/api/v1/points/themes/{theme_id}/';
const pointsByCategoryUrl = 'https://wazimap-ng.openup.org.za/api/v1/points/categories/{category_id}/';

const iterationLimit = 10;  //iteration limit of the xhr calls, ideally we shouldn't have this
const wrapperClsName = 'point-data__content_wrapper';
const pointDataItemClsName = 'point-data__h1--dropdown';
const categoryWrapperClsName = 'point-data__h1_content';
const categoryItemClsName = 'point-data__h2_wrapper';
const treeLineClsName = 'point-data__h2_tree-line-v';
const activeClsName = 'active-1';
const passiveColor = '#f7f7f7';
let pointDataItem = null;
let categoryItem = null;
let treeLineItem = null;
let markers = null;
let themeCategories = [];
let activePoints = [];  //the visible points on the map

let colors = ['#dfe8ff', '#ebdcfa', '#ffe2ee', '#badc58', '#7ed6df', '#ea8685', '#cf6a87', '#9AECDB', '#FEA47F', '#1dd1a1'];    //colors of the point data dialog

/**
 * this class creates the point data dialog
 */
export class PointData extends Observable {
    constructor(_map) {
		super();
        this.map = _map;
        this.selectedThemes = [];
        this.selectedCategories = [];

        markers = L.markerClusterGroup();

        this.prepareDomElements();
        this.getThemes();
    }

    /**
     * gets the necessary classes, removes unneeded elements
     */
    prepareDomElements = () => {
        pointDataItem = $('.' + pointDataItemClsName)[0].cloneNode(true);
        categoryItem = $('.' + categoryItemClsName)[1].cloneNode(true);
        treeLineItem = $('.' + treeLineClsName)[0].cloneNode(true);

        $('.' + wrapperClsName).html('');
    }

    /**
     * gets the themes and creates the point data dialog
     * */
    getThemes = () => {
        let self = this;

        getJSON(url).then((data) => {
            if (data.results !== null && data.results.length > 0) {
                for (let i = 0; i < data.results.length; i++) {
                    let item = pointDataItem.cloneNode(true);
                    $('.h1__trigger_title .truncate', item).text(data.results[i].name);
                    $('.point-data__h1_trigger', item).css('background-color', colors[i % 10]); //todo:get the color from the API
                    $('.' + categoryWrapperClsName, item).html('');

                    if (data.results[i].categories !== null && data.results[i].categories.length > 0) {
                        for (let j = 0; j < data.results[i].categories.length; j++) {
                            themeCategories.push({
                                themeId: data.results[i].id,
                                categoryId: data.results[i].categories[j].id
                            })
                            let cItem = categoryItem.cloneNode(true);
                            $(cItem).on('click', () => self.selectedCategoriesChanged(cItem, data.results[i].categories[j], i));
                            $(cItem).find('.point-data__h2').removeClass(activeClsName);
                            $('.truncate', cItem).text(data.results[i].categories[j].name);
                            $('.point-data__h2_link', cItem).removeClass('point-data__h2_link').addClass('point-data__h2_link--disabled');

                            $(item).find('.' + categoryWrapperClsName).append(cItem);

                            if (j === data.results[i].categories.length - 1) {
                                //last
                                $(cItem).find('.point-data__h2').addClass('last');
                            }
                        }
                    }
                    //append tree
                    let treeItem = treeLineItem.cloneNode(true);
                    $('.' + categoryWrapperClsName, item).append(treeItem);

                    $(item).find('.point-data__h1_checkbox input[type=checkbox]').on('click', () => self.selectedThemesChanged(item, data.results[i], i));

                    $('.' + wrapperClsName).append(item);
                }
            }
        })
    }

    /**
     * this function is called when a category is toggled
     * */
    selectedCategoriesChanged = (cItem, category, index) => {
        if ($(cItem).find('.point-data__h2').hasClass(activeClsName)) {
            this.triggerEvent('categorySelected', {category: category});

            this.selectedCategories.splice(this.selectedCategories.indexOf(category.id), 1);
            $(cItem).find('.point-data__h2').removeClass(activeClsName);
            $(cItem).find('.point-data__h2').css('background-color', passiveColor);
            this.removeCategoryPoints(category);
        } else {
            this.triggerEvent('categoryUnselected', {category: category});

            this.selectedCategories.push(category.id);
            $(cItem).find('.point-data__h2').addClass(activeClsName);
            $(cItem).find('.point-data__h2').css('background-color', colors[index % 10]); //todo:get the color from the API
            this.showCategoryPoint(category);
        }
    }

    showCategoryPoint = (category) => {
        let categoryUrl = pointsByCategoryUrl.replace('{category_id}', category.id);
        let iterationCounter = 0;

        this.getAddressPoints(categoryUrl, iterationCounter);
    }

    removeCategoryPoints = (category) => {
        activePoints = activePoints.filter((item) => {
            return item.categoryId !== category.id
        });

        this.showPointsOnMap();
    }
    /** end of category functions **/

    /**
     * this function is called when a theme is toggled
     * */
    selectedThemesChanged = (item, theme, index) => {
        if ($(item).find('.point-data__h1_checkbox input[type=checkbox]').is(':checked')) {
            //theme added
            this.triggerEvent('themeSelected', {theme: theme, item: item});

            this.selectedThemes.push(theme.id);
            this.showThemePoints(theme).then(data => {
				this.triggerEvent('themePointLoaded', {data: data, item: item})
			});

            $(item).find('.' + categoryItemClsName).each(function () {
                if (!$(this).find('.point-data__h2').hasClass(activeClsName)) {
                    $(this).find('.point-data__h2').addClass(activeClsName);
                    $(this).find('.point-data__h2').css('background-color', colors[index % 10]); //todo:get the color from the API
                }
            })
        } else {
            //theme removed
            this.triggerEvent('themeUnselected', {theme: theme, item: item});

            this.selectedThemes.splice(this.selectedThemes.indexOf(theme.id), 1);
            this.removeThemePoints(theme);

            $(item).find('.' + categoryItemClsName).each(function () {
                if ($(this).find('.point-data__h2').hasClass(activeClsName)) {
                    $(this).find('.point-data__h2').removeClass(activeClsName);
                    $(this).find('.point-data__h2').css('background-color', passiveColor); //todo:get the color from the API
                }
            })
        }
    }

    showThemePoints = (theme) => {
        let themeUrl = pointsByThemeUrl.replace('{theme_id}', theme.id);
        let iterationCounter = 0;

        return this.getAddressPoints(themeUrl, iterationCounter);
    }

    removeThemePoints = (theme) => {
        activePoints = activePoints.filter((item) => {
            return item.themeId !== theme.id
        });

        this.showPointsOnMap();
    }
    /** end of theme functions **/

    /**
     * calls the API iteratively to get the points
     * requestUrl : API url, can be pointsByThemeUrl or pointsByCategoryUrl
     * iterationCounter : this parameter is used to check if we hit the iteration limit or not
     * id : id of category or theme requested
     * type : 'Category' or 'Theme'
     */
    getAddressPoints = (requestUrl, iterationCounter) => {
        requestUrl = requestUrl.replace('http://', 'https://');
        return getJSON(requestUrl).then((data) => {
            if (data.features !== null && data.features.length > 0) {
                for (let i = 0; i < data.features.length; i++) {
                    let categoryId = data.features[i].properties.category.id;
                    let themeId = themeCategories.filter((item) => {
                        return item.categoryId === categoryId
                    })[0].themeId;

                    activePoints.push({
                        x: data.features[i].geometry.coordinates[0],
                        y: data.features[i].geometry.coordinates[1],
                        name: data.features[i].properties.data.Name,
                        categoryId: categoryId,
                        themeId: themeId
                    })
                }

                if (++iterationCounter < iterationLimit && data.next !== null && data.features !== null && data.features.length > 0) {
                    //has more
                    this.triggerEvent('iterationCompleted', {iterationCounter: iterationCounter, data: data});

                    return this.getAddressPoints(data.next, iterationCounter);
                } else {
                    //completed
                    this.triggerEvent('addressPointsTake', {data: data});

                    this.showPointsOnMap();
				
					//Return data object for next promise
					return data;
                }
            }
        })
    }

    /**
     * clears the map, puts back the points that are in activePoints array
     */
    showPointsOnMap = () => {
        markers.clearLayers();

        if (activePoints !== null && activePoints.length > 0) {
            for (let i = 0; i < activePoints.length; i++) {
                let a = activePoints[i];
                let title = a.name;
                let marker = L.marker(new L.LatLng(a.y, a.x), {title: title});
                marker.bindPopup(title);
                markers.addLayer(marker);
            }
        }

        this.map.addLayer(markers);
    }
}
