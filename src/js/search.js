import {Observer} from './utils';
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

/**
 * This class is responsible for handling the search box with all of its events
 * When typing starts it fires of a BeforeSearch event with the search query
 * When a result result is returned, it fills the search box with autocomplete options.
 * When an option is clicked, a chip is placed in the search box indicating the selected geography. A ResultClick event is fired
 * When the X is clicked on the chip, the chip disappears and a ClearSearch event is fired.
 */
export class Search {
    /**
     * @param  {Number} minChars Minimum number of characters that are needed before a search request is fired
     */
    constructor(minChars=3) {
        this.observer = new Observer();
        this.minChars = minChars;
    };

    /**
     * Run a search using the server backend
     * @param  {[type]} query [description]
     * @return {[type]}       [description]
     */
    search(query) {
    };

    /**
     * Listeners register for events - the following events should be supported
     * BeforeSearch - payload is the search query
     * SearchResults - payload is a list of results
     * ResultClick - payload is the search result that is clicked on
     * ClearSearch - payload is empty
     */
    on(event, func) {
        this.observer.on(event, func);
    };

    /**
     * This method sends callbacks to all listeners of a particular event
     */
    triggerEvent(event, payload) {
        this.observer.triggerEvent(event, payload)
    };
}