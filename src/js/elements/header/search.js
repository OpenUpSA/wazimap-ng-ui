import {Component} from '../../utils';
import {select as d3select} from 'd3-selection';
import {Dropdown} from "../../ui_components/dropdown";

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
    constructor(parent, api, profileId, minChars) {
        super(parent);

        minLength = minChars;
        this.api = api;
        this.profileId = profileId;
        this.plate = null;

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
        this.appendSearchSeparator();
        this.appendPointsTitle(titleRow);
        this.appendPointsNoData();
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
        $($(pointTitleRow).find('div')[0]).text('SERVICE POINTS');
        $($(pointTitleRow).find('div')[1]).text('30 SERVICE POINTS IN 3 CATEGORIES');
        this.plate.append(pointTitleRow)
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
            title: 'NAME',
            width: '30%'
        }, {
            title: 'SHOW MATCHING RESULTS',
            width: '30%'
        }, {
            title: 'MATCHING SNIPPET',
            width: '25%'
        }, {
            title: 'DISTANCE',
            width: '15%'
        }].forEach(c => {
            const pointsHeaderColumn = document.createElement('div');
            $(pointsHeaderColumn).addClass('search-result-point-table-header-column')
            $(pointsHeaderColumn).text(c.title);
            $(pointsHeaderColumn).css('width', c.width);

            pointsTableHeader.append(pointsHeaderColumn);
        })
        this.plate.append(pointsTableHeader)

    }

    appendPointsTable(data) {
        this.plate.find('.search-result-point-container').remove();

        const pointResultContainer = document.createElement('div');
        $(pointResultContainer).addClass('search-result-point-container').addClass('narrow-scroll');
        for (let i = 0; i < data.features.length; i++) {
            const pointRow = this.createPointSearchRow(data.features[i]);

            pointResultContainer.append(pointRow);
        }

        this.plate.append(pointResultContainer);
    }

    createPointSearchRow(rowData) {
        const pointRow = document.createElement('div');
        $(pointRow).addClass('search-result-point-row');

        const pointColumn = this.createPointSearchColumn(rowData.properties['name'], '30%');
        pointRow.append(pointColumn);

        const pointColumn2 = this.createPointSearchDropdown('30%', rowData.properties['icon'], rowData.properties['theme_name']);
        pointRow.append(pointColumn2);

        const pointColumn3 = this.createPointSearchColumn(rowData.properties['theme_name'], '25%');
        pointRow.append(pointColumn3);

        const distance = `${parseInt(rowData.properties['distance'])} km`;
        const pointColumn4 = this.createPointSearchColumn(distance, '15%');
        pointRow.append(pointColumn4);

        return pointRow;
    }

    createPointSearchColumn(text, width) {
        const pointColumn = document.createElement('div');
        $(pointColumn).prop('title', text);
        $(pointColumn).css('width', width);
        $(pointColumn).addClass('search-result-point-column');
        $(pointColumn).text(text);

        return pointColumn;
    }

    createPointSearchDropdown(width, icon, text) {
        const pointColumn = document.createElement('div');
        $(pointColumn).addClass('search-result-point-column');
        $(pointColumn).css('width', width);

        $(pointColumn).html(new Dropdown(this, pointColumn, ['Plot all points in category', 'Plot matching points in category'], text, false, false, false));

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
                minLength: minLength,
                source: function (request, response) {
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

                        const mapCenter = self.getMapCenter();
                        self.api.searchPointsByDistance(self.profileId, searchTerm, mapCenter.lat, mapCenter.lng).then(data => {
                            self.removePointsNoData();
                            self.appendPointsHeaderRow();
                            self.appendPointsTable(data);
                        })
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

        if (skipTopLevel)
            parents = parents.slice(0, -1);


        parents.forEach((parent, idx) => {
            if (!skipDuplicates || parent.name != previous) {
                if (idx > 0)
                    label += ', '
                label += parent.name;
            }

            previous = parent.name;
        })

        return {
            name: profile.name,
            parents: label
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
