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
const categoryItemLoadingClsName = 'point-data__h2_loading';
const categoryItemDoneClsName = 'point-data__h2_load-complete';
const treeLineClsName = 'point-data__h2_tree-line-v';
const pointMarkerPositionClsName = 'point-marker__position';
//const popupItemClsName = 'point-marker__tooltip_card';
const popupItemClsName = 'point-marker__tooltip';
const activeClsName = 'active-1';
const passiveColor = '#f7f7f7';
let pointDataItem = null;
let categoryItem = null;
let treeLineItem = null;
let popupItem = null;
let markers = null;
let themeCategories = [];
let activePoints = [];  //the visible points on the map
let addrPointCancelTokens = {};

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
    }

    /**
     * gets the necessary classes, removes unneeded elements
     */
    prepareDomElements = () => {
        pointDataItem = $('.' + pointDataItemClsName)[0].cloneNode(true);
        categoryItem = $('.' + categoryItemClsName)[0].cloneNode(true);
		$(categoryItem).find('.' + categoryItemLoadingClsName).addClass('hide');
		$(categoryItem).find('.' + categoryItemDoneClsName).addClass('hide');
        treeLineItem = $('.' + treeLineClsName)[0].cloneNode(true);
        popupItem = $('.' + pointMarkerPositionClsName).find('.' + popupItemClsName)[0].cloneNode(true);

        $('.' + wrapperClsName).html('');
    }

    /**
     * gets the themes and creates the point data dialog
     * */
    loadThemes = () => {
        let self = this;
		self.triggerEvent("loadingThemes", self);

        getJSON(url).then((data) => {
            if (data.results !== null && data.results.length > 0) {
                for (let i = 0; i < data.results.length; i++) {
                    let item = pointDataItem.cloneNode(true);
                    $('.h1__trigger_title .truncate', item).text(data.results[i].name);
                    $('.point-data__h1_trigger', item).css('background-color', passiveColor);
                    //$('.point-data__h1_trigger', item).css('background-color', colors[i % 10]); //todo:get the color from the API
                    $('.' + categoryWrapperClsName, item).html('');

                    if (data.results[i].categories !== null && data.results[i].categories.length > 0) {
                        for (let j = 0; j < data.results[i].categories.length; j++) {
                            themeCategories.push({
                                themeId: data.results[i].id,
                                categoryId: data.results[i].categories[j].id
                            })
                            let cItem = categoryItem.cloneNode(true);
                            $(cItem).on('click', () => self.selectedCategoriesChanged(cItem, item, data.results[i].categories[j], i));
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
			
			self.triggerEvent("loadedThemes", data);
        })
    }

    /**
     * this function is called when a category is toggled
     * */
    selectedCategoriesChanged = (cItem, item, category, index) => {
        if ($(cItem).find('.point-data__h2').hasClass(activeClsName)) {
            this.triggerEvent('categoryUnselected', {category: category, item: cItem});

            this.selectedCategories.splice(this.selectedCategories.indexOf(category.id), 1);
            $(cItem).find('.point-data__h2').removeClass(activeClsName);
            $(cItem).find('.point-data__h2').css('background-color', passiveColor);
            
            if($(item).find('.' + categoryItemClsName).find('.' + activeClsName).length == 0)
            {
                $('.point-data__h1_trigger', item).css('background-color', passiveColor);
                $(item).find('.point-data__h1_checkbox input[type=checkbox]').prop( "checked", false );
            }
            
            this.removeCategoryPoints(category);
        } else {
            this.triggerEvent('categorySelected', {category: category, item: cItem});

            this.selectedCategories.push(category.id);
            $(cItem).find('.point-data__h2').addClass(activeClsName);
            $(cItem).find('.point-data__h2').css('background-color', colors[index % 10]); //todo:get the color from the API
            $('.point-data__h1_trigger', item).css('background-color', colors[index % 10]);
            
            if($(item).find('.' + categoryItemClsName).find('.' + activeClsName).length == $(item).find('.' + categoryItemClsName).length)
            {
                $(item).find('.point-data__h1_checkbox input[type=checkbox]').prop( "checked", true );
            }
            
            this.showCategoryPoint(category).then(data => {
				this.triggerEvent('categoryPointLoaded', {data: data, item: cItem})
			});
        }
    }

    showCategoryPoint = (category) => {
        let categoryUrl = pointsByCategoryUrl.replace('{category_id}', category.id);
        let iterationCounter = 0;
        
        const tokenIndex = "category_id-" + category.id;
        
        if(addrPointCancelTokens[tokenIndex] == undefined)
            addrPointCancelTokens[tokenIndex] = []

        const token = { token: "" };
        
        addrPointCancelTokens[tokenIndex].push(token);
        return this.getAddressPoints(categoryUrl, iterationCounter, token).then((data) => {
                let index = addrPointCancelTokens[tokenIndex].indexOf(token);
                if(index !== -1) {
                  addrPointCancelTokens[tokenIndex].splice(index, 1);
                }
                return data;
            });
    }

    removeCategoryPoints = (category) => {
        const tokenIndex = "category_id-" + category.id;
        if(addrPointCancelTokens[tokenIndex])
        {
            for (let i = 0; i < addrPointCancelTokens[tokenIndex].length; i++) {
                addrPointCancelTokens[tokenIndex][i].token = "cancel";
            }
        }
        
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
            
            $('.point-data__h1_trigger', item).css('background-color', colors[index % 10]);
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
            
            $('.point-data__h1_trigger', item).css('background-color', passiveColor);
        }
    }

    showThemePoints = (theme) => {
        //need to remove for in case its already showing some from selected item
        this.removeThemePoints(theme);
        let themeUrl = pointsByThemeUrl.replace('{theme_id}', theme.id);
        let iterationCounter = 0;
        
        const tokenIndex = "theme_id-" + theme.id;
        if(addrPointCancelTokens[tokenIndex] == undefined)
            addrPointCancelTokens[tokenIndex] = []

        var token = { token: "" };
        
        addrPointCancelTokens[tokenIndex].push(token);
        return this.getAddressPoints(themeUrl, iterationCounter, token).then((data) => {                
                let index = addrPointCancelTokens[tokenIndex].indexOf(token);
                if(index !== -1) {
                  addrPointCancelTokens[tokenIndex].splice(index, 1);
                }
                return data;
            });
    }

    removeThemePoints = (theme) => {
        const themeIndex = "theme_id-" + theme.id;
        if(addrPointCancelTokens[themeIndex])
        {
            for (let i = 0; i < addrPointCancelTokens[themeIndex].length; i++) {
                addrPointCancelTokens[themeIndex][i].token = "cancel";
            }
        }
        
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
    getAddressPoints = (requestUrl, iterationCounter, cancelToken = undefined) => {
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
                        categoryName: data.features[i].properties.category.name,
                        themeId: themeId
                    })
                }
                
                if(cancelToken != undefined && cancelToken.token != "")
                    return cancelToken.token;

                if (++iterationCounter < iterationLimit && data.next !== null && data.features !== null && data.features.length > 0) {
                    //has more
                    this.triggerEvent('iterationCompleted', {iterationCounter: iterationCounter, data: data});

                    return this.getAddressPoints(data.next, iterationCounter, cancelToken);
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
        self = this;
        
        if (activePoints !== null && activePoints.length > 0) {
            for (let i = 0; i < activePoints.length; i++) {
                let a = activePoints[i];
                let marker = L.marker(new L.LatLng(a.y, a.x));
                let popupItemClone = popupItem.cloneNode(true);
                
                let name = a.name;
                if(name == undefined || name == "")
                    name = "Unknown";    
                
                $(popupItemClone).find('.tooltip__card_title').text(name);
                $(popupItemClone).find('.tooltip__card_subtitle').text(a.categoryName);
                $(popupItemClone).show();
                $(popupItemClone).css('opacity','');
                const existingStyles = $(popupItemClone).attr('style');
                $(popupItemClone).attr('style', existingStyles + '; ' + 'display: flex !important','');
                
                marker.on('mouseover', function(e) {
                    this.bindPopup($(popupItemClone).prop('outerHTML'), { maxWidth: "auto", closeButton: false });
                    this.openPopup()
                    let popupElement = $(this.getPopup().getElement());
                    popupElement.find('.leaflet-popup-content-wrapper').removeClass('leaflet-popup-content-wrapper');
                    popupElement.find('.leaflet-popup-tip-container').remove();
                    let tooltipElement = popupElement.find('.point-marker__tooltip');
                    tooltipElement.attr('style', 'font: unset; font-family: Roboto, sans-serif; font-size: 14px; line-height: 20px;');
                });
                
                marker.on('mouseout', function (e) {
                    this.closePopup();
                });
                
                markers.addLayer(marker);
            }
        }

        this.map.addLayer(markers);
    }
}
