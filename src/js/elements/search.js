import {Observable} from '../utils';
import {select as d3select} from 'd3-selection';

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
    constructor(api, profileId, minChars) {
        super();

        minLength = minChars;
        this.api = api;
        this.profileId = profileId;

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
                    const searchTerm = request.term;

                    self.api.search(self.profileId, searchTerm).then(data => {
                        self.triggerEvent('searchResults', {items: data});

                        count = data.length;
                        $('.search__dropdown_results-value').html(count);  //this needs to be here because if 0 row returns from the API, render function is not fired

                        response(data);
                    })
                }
            }).autocomplete('instance')._renderItem = function (ul, item) {
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

    generateSearchLabel(profile, skipTopLevel=true, skipDuplicates=true) {
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
