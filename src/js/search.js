import {Observable} from './utils';
import {select as d3select} from 'd3-selection';

var navSearch = d3select(".nav__search");

/**
 * When a profile is loaded, update the chip in the searchbox
 * TODO - might want to consider folding this into the Search class
 */
export function onProfileLoaded(payload) {
    var profile = payload.payload;
    navSearch.select(".search-chip .truncate").text(profile.getFullName());
}

const searchUrl = 'https://wazimap-ng.openup.org.za/api/v1/geography/search/';
let minLength = 3;
const clsName = 'location__search_input';
let searchResultItem = '';

/**
 * This class is responsible for handling the search box with all of its events
 * */
export class Search extends Observable {
    /**
     * constructor of the class
     * sets the default values, calls init function(this.setSearchInput)
     * */
    constructor(minChars) {
        super();

        minLength = minChars;

        this.prepareDomElements();
        this.setSearchInput();
    };

    prepareDomElements = () =>{
        searchResultItem = $('.search__dropdown_list-item')[0].cloneNode(true);
        this.emptySearchResults();
    }

    /**
     * converts inputs that has 'search-autocomplete' class to autocomplete inputs
     * */
    setSearchInput = () => {
        let self = this;
        let count = 0;
        $('.' + clsName).each(function () {
            let element = $(this);

            $(this).autocomplete({
                minLength: minLength,
                source: function (request, response) {
                    self.triggerEvent('beforeSearch', {term: request.term});
                    self.emptySearchResults();

                    $.ajax({
                        url: searchUrl,
                        dataType: 'json',
                        data: {
                            q: request.term
                        },
                        success: function (data) {
                            self.triggerEvent('searchResults', {items: data});

                            count = data.length;
                            $('.search__dropdown_label').html(count + ' Results');  //this needs to be here because if 0 row returns from the API, render function is not fired

                            response(data);
                        }
                    });
                }
            }).autocomplete('instance')._renderItem = function (ul, item) {
                /**
                 * styling the result items
                 */
                $('.ui-widget-content').remove();

                let resultItem = searchResultItem.cloneNode(true);
                $(".truncate", resultItem).text(item.name);
                $(".search__list-item_geography-type div", resultItem).text(item.level);

                return $("<div>")
                    .append(resultItem)
                    .on('click', () => self.searchResultSelected(item, element))
                    .appendTo($('.search__dropdown_list'));
            };
        });
    }

    /**
     * creating a chip when an item is selected
     * */
    searchResultSelected = (item, element) => {
        /**
         * the callback function that is triggered when a result item is selected
         */
        this.triggerEvent('resultClick', item)

        $('.nav__search_deselect').click();
        $(element).val('');
        this.emptySearchResults();

        let chipWrapper = $('.search__chips_wrapper');
        let chip = $('.search-chip')[0].cloneNode(true);
        $('.truncate', chip).text(item.name + ' (' + item.code + ')');
        $('.search-chip', chipWrapper).remove();
        chipWrapper.append(chip);

        $('.search-chip').find('.chip__action-icon').on('click', () => this.selectedChipRemoved(item, element))
    }

    emptySearchResults = () =>{
        $('.search__dropdown_list').html('');
        $('.search__dropdown_label').html('No Results');
    }

    /**
     * removing the selected chip
     * */
    selectedChipRemoved = (item, element) => {
        this.triggerEvent('clearSearch', null);
    }
}
