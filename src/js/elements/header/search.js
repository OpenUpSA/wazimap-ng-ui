import {Component} from '../../utils';
import {select as d3select} from 'd3-selection';
import {Dropdown, DropdownModel} from "../../ui_components/dropdown";
import React from "react";

// TODO should change this to jquery instead
var navSearch = d3select(".nav__search");

/**
 * When a profile is loaded, update the chip in the searchbox
 * TODO - might want to consider folding this into the Search class
 */
export function onProfileLoaded(payload) {
    const profile = payload.payload;
    navSearch.select(".search-chip .truncate").text(profile.getFullName());
}

const inputClassName = '.location__search_input';
const parentClassName = '.nav__search_input';
const searchDdClassName = '.nav__search_dropdown';
const resultItemClassName = '.search__dropdown_list-item';

let startSearchingClone = null;
let searchResultItem = '';
let minLength = 3;

/**
 * This class is responsible for handling the search box with all of its events
 * */
export class Search extends Component {
    /**
     * constructor of the class
     * sets the default values, calls init function(this.setSearchInput)
     * */
    constructor(parent, api, profileId, minChars, config) {
        super(parent);

        minLength = minChars;
        this.api = api;
        this.profileId = profileId;
        this.plate = null;
        this.config = config;

        this.prepareDomElements();
        this.setSearchInput();
    };

    prepareDomElements = () => {
        startSearchingClone = $('.search__dropdown_plate')[0].cloneNode(true);
        searchResultItem = $(resultItemClassName)[0].cloneNode(true);
        $(parentClassName).find('.w-form-fail').remove();
        $(parentClassName).find('.w-form-done').remove();

        this.updateSearchDom();
    }

    updateSearchDom() {
        this.plate = $('.search__dropdown_plate')
            .css('max-height', 'unset');
        const titleRow = $('.search__dropdown_results-label');

        this.updateGeoSearchHeader(titleRow);
        this.updateGeoSearch();
        if (this.config.pointSearchEnabled) {
            this.appendSearchSeparator();
            this.appendPointsTitle(titleRow);
            this.appendPointsNoData();
        }
    }

    updateGeoSearchHeader(titleRow) {
        const headerColumn = titleRow.find('div')[0].cloneNode(true);

        titleRow.append(headerColumn);
        $(titleRow.find('div')[0]).text('GEOGRAPHIC BOUNDARIES').css('flex', '50%');
    }

    updateGeoSearch() {
        $('.search__dropdown_scroll').css('overflow', 'visible')
            .removeClass('narrow-scroll');
        $('.search__dropdown_list').css('max-height', '150px')
            .css('overflow-y', 'scroll')
            .addClass('narrow-scroll');
    }

    appendSearchSeparator() {
        let separator = document.createElement('hr');
        $(separator).addClass('separator')
        this.plate.append(separator);
    }

    appendPointsTitle(titleRow) {
        const pointTitleRow = titleRow[0].cloneNode(true);
        $(pointTitleRow).addClass('search-result-point-table-summary-row')
        $($(pointTitleRow).find('div')[0]).text('SERVICE POINTS');
        $($(pointTitleRow).find('div')[1]).addClass('search-result-point-table-summary-text')
            .text('')
        this.plate.append(pointTitleRow)
    }

    updatePointsHeaderSummary(data) {
        $('.search-result-point-table-summary-row .search-result-point-table-summary-text')
            .text(`${data.features.length} SERVICE POINTS IN ${[...new Set(data.features.map(item => item.properties.theme_id))].length} THEMES`)
    }

    appendPointsNoData() {
        const noDataContainer = $('.search__dropdown_no-data')[0].cloneNode(true);
        $(noDataContainer).addClass('points-no-data');
        this.plate.append(noDataContainer);
    }

    removePointsNoData() {
        this.plate.find('.points-no-data').remove();
    }

    appendPointsHeaderRow() {
        this.plate.find('.search-result-point-table-header').remove();

        const pointsTableHeader = document.createElement('div');
        $(pointsTableHeader).addClass('search-result-point-table-header');

        [{
            title: 'NAME', width: '30%'
        }, {
            title: 'SHOW MATCHING RESULTS', width: '30%'
        }, {
            title: 'MATCHING SNIPPET', width: '25%'
        }, {
            title: 'DISTANCE', width: '15%'
        }].forEach(c => {
            const pointsHeaderColumn = document.createElement('div');
            $(pointsHeaderColumn).addClass('search-result-point-table-header-column')
            $(pointsHeaderColumn).text(c.title);
            $(pointsHeaderColumn).css('width', c.width);

            pointsTableHeader.append(pointsHeaderColumn);
        })
        this.plate.append(pointsTableHeader)

    }

    appendPointsTable(searchTerm, data) {
        this.plate.find('.search-result-point-container').remove();

        const pointResultContainer = document.createElement('div');
        $(pointResultContainer).addClass('search-result-point-container').addClass('narrow-scroll');
        for (let i = 0; i < data.features.length; i++) {
            const pointRow = this.createPointSearchRow(searchTerm, data.features[i]);

            pointResultContainer.append(pointRow);
        }

        this.plate.append(pointResultContainer);
    }

    createPointSearchRow(searchTerm, rowData) {
        const self = this;
        const pointRow = document.createElement('div');
        $(pointRow).addClass('search-result-point-row');

        const pointNameColumn = this.createPointSearchColumn(rowData.properties['name'], '30%');
        pointRow.append(pointNameColumn);

        const pointThemeColumn = this.createPointSearchDropdown('30%', rowData);
        pointRow.append(pointThemeColumn);

        const pointMatchColumn = this.createPointSearchColumn(this.getMatchingSnippet(searchTerm, rowData), '25%');
        pointRow.append(pointMatchColumn);

        const distance = `${parseInt(rowData.properties['distance'])} km`;
        const pointDistanceColumn = this.createPointSearchColumn(distance, '15%');
        pointRow.append(pointDistanceColumn);

        $(pointRow).on('click', () => {
            self.triggerEvent('search.point.selected', rowData);
        })

        return pointRow;
    }

    getMatchingSnippet(searchTerm, rowData) {
        const term = searchTerm.toLowerCase();
        const properties = rowData.properties;
        let text = '';
        if (properties['name'].toLowerCase().indexOf(term) >= 0) {
            text = properties['name'];
        } else if (properties['category_name'].toLowerCase().indexOf(term) >= 0) {
            text = properties['category_name'];
        } else if (properties['theme_name'].toLowerCase().indexOf(term) >= 0) {
            text = properties['theme_name'];
        } else if (properties['theme_name'].toLowerCase().indexOf(term) >= 0) {
            text = properties['theme_name'];
        } else {
            let dataArr = properties['data'];
            console.log({dataArr})
            let i = 0;
            while (i < dataArr.length && text === '') {
                console.log({i, 'data': dataArr[i]})
                if ((typeof dataArr[i].value === 'string' && dataArr[i].value.toLowerCase().indexOf(term) >= 0) || (dataArr[i].value === term)) {
                    text = dataArr[i].value;
                }
                i++;
            }
        }

        if (text.toLowerCase().indexOf(term) !== 0) {
            text = '...' + text.substring(text.toLowerCase().indexOf(term));
        }

        return text;
    }

    createPointSearchColumn(text, width) {
        const pointColumn = document.createElement('div');
        $(pointColumn).prop('title', text);
        $(pointColumn).css('width', width);
        $(pointColumn).addClass('search-result-point-column');
        $(pointColumn).text(text);

        return pointColumn;
    }

    createPointSearchDropdown(width, rowData) {
        const pointColumn = document.createElement('div');
        $(pointColumn).addClass('search-result-point-column');
        $(pointColumn).css('width', width);

        const properties = rowData.properties;

        const icon = properties['icon'];
        const themeName = properties['theme_name'];
        const categoryId = properties['category_id'];
        const color = properties['color'];

        const ddText = <span className={'dd-text-container'}><i className="material-icons"
                                                                style={{color: color}}>{icon}</i> {themeName}</span>;

        let dd = new Dropdown(this, pointColumn, ['Plot all points in category'], ddText, false, false, false, null, false);
        dd.model.on(DropdownModel.EVENTS.selected, selectedOptionArr => {
            const selectedOption = selectedOptionArr[0];
            let category = {
                id: categoryId, theme: {
                    icon: icon, color: color
                }
            }
            this.triggerEvent('search.category.selected', category);
        })

        $(pointColumn).html(dd);

        return pointColumn;
    }

    /**
     * converts inputs that has 'search-autocomplete' class to autocomplete inputs
     * */
    setSearchInput = () => {
        let self = this;
        let lastKey = 0;
        let activeItemIndex = -1;
        $(inputClassName).each(function () {
            let element = $(this);

            $(this).autocomplete({
                minLength: minLength, source: function (request, response) {
                    setTimeout(() => {
                        if (lastKey === 38 || lastKey === 40) {
                            //arrow keys -- add active class to result item
                            const maxIndex = $(searchDdClassName).find(resultItemClassName).length - 1;
                            activeItemIndex = lastKey == 38 ? activeItemIndex - 1 : activeItemIndex + 1;
                            activeItemIndex = activeItemIndex < 0 ? 0 : activeItemIndex;
                            activeItemIndex = activeItemIndex > maxIndex ? maxIndex : activeItemIndex;
                            $(resultItemClassName + '.active').removeClass('active');
                            $($(resultItemClassName)[activeItemIndex]).addClass('active');
                            return;
                        } else {
                            activeItemIndex = -1;
                        }
                        self.triggerEvent('search.before', {term: request.term});
                        self.emptySearchResults();
                        const searchTerm = request.term;

                        self.api.search(self.profileId, searchTerm).then(data => {
                            self.appendGeoSearchResult(data);
                            response(data);
                        })

                        if (self.config.pointSearchEnabled) {
                            const mapCenter = self.getMapCenter();
                            self.api.searchPointsByDistance(self.profileId, searchTerm, mapCenter.lat, mapCenter.lng).then(data => {
                                self.removePointsNoData();
                                self.appendPointsHeaderRow();
                                self.appendPointsTable(searchTerm, data);
                                self.updatePointsHeaderSummary(data);
                            })
                        }
                    }, 0)
                }
            })
                .keydown(function (event) {
                    self.getMapCenter();
                    const key = event.keyCode;
                    lastKey = key;

                    if (lastKey === 13) {
                        //enter
                        $(resultItemClassName + '.active').click();
                    }
                })
                .autocomplete('instance')._renderItem = function (ul, item) {
                /**
                 * styling the result items
                 */
                $('.ui-widget-content').remove();

                const resultItem = searchResultItem.cloneNode(true);
                const labels = self.generateSearchLabel(item);
                $(".search__list-item_location-name .truncate", resultItem).text(labels.name);
                $(".search__list-item_location-parent .truncate", resultItem).text(labels.parents);
                $(".search__list-item_location-type div", resultItem).text(item.level);

                return $("<div>")
                    .append(resultItem)
                    .on('click', () => self.searchResultSelected(item, element))
                    .appendTo($('.search__dropdown_list'));
            };
        });
    }

    getMapCenter() {
        return map.getCenter();
    }

    appendGeoSearchResult(data) {
        this.triggerEvent('search.results', {items: data});

        const count = data.length;
        $('.search__dropdown_results-value').html(count);  //this needs to be here because if 0 row returns from the API, render function is not fired
    }

    generateSearchLabel(profile, skipTopLevel = true, skipDuplicates = true) {
        let parents = profile.parents;
        let label = '';
        let previous = '';

        parents = parents.reverse();

        if (skipTopLevel) parents = parents.slice(0, -1);


        parents.forEach((parent, idx) => {
            if (!skipDuplicates || parent.name != previous) {
                if (idx > 0) label += ', '
                label += parent.name;
            }

            previous = parent.name;
        })

        return {
            name: profile.name, parents: label
        };
    }

    /**
     * creating a chip when an item is selected
     * */
    searchResultSelected = (item, element) => {
        /**
         * the callback function that is triggered when a result item is selected
         */
        this.triggerEvent('search.resultClick', item);

        const clone = startSearchingClone.cloneNode(true);

        $('.nav__search_deselect').click();
        $(element).val('');
        this.emptySearchResults();

        $(searchDdClassName).html('');
        $(searchDdClassName).append(clone);
    }

    emptySearchResults = () => {
        $('.search__dropdown_list').html('');
    }

    /**
     * removing the selected chip
     * */
    selectedChipRemoved = (item, element) => {
        this.triggerEvent('search.clear', null);
    }
}
