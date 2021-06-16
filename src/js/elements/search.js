import {Component} from '../utils';
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

        this.prepareDomElements();
        this.setSearchInput();
    };

    prepareDomElements = () => {
        startSearchingClone = $('.search__dropdown_plate')[0].cloneNode(true);
        searchResultItem = $(resultItemClassName)[0].cloneNode(true);
        $(parentClassName).find('.w-form-fail').remove();
        $(parentClassName).find('.w-form-done').remove();
    }

    /**
     * converts inputs that has 'search-autocomplete' class to autocomplete inputs
     * */
    setSearchInput = () => {
        let self = this;
        let count = 0;
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
                            self.triggerEvent('search.results', {items: data});

                            count = data.length;
                            $('.search__dropdown_results-value').html(count);  //this needs to be here because if 0 row returns from the API, render function is not fired

                            response(data);
                        })
                    }, 0)
                }
            })
                .keydown(function (event) {
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
