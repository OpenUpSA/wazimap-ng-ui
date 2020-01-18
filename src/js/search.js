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

/**
 * Listeners register for events - the following events should be supported
 * BeforeSearch - payload is the search query
 * SearchResults - payload is a list of results
 * ResultClick - payload is the search result that is clicked on
 * ClearSearch - payload is empty
 */
export class Search extends Observable {
    /**
     * @param  {Number} minChars Minimum number of characters that are needed before a search request is fired
     */
    constructor(minChars=3) {
        this.minChars = minChars;
    };

    /**
     * Run a search using the server backend
     * @param  {[type]} query [description]
     * @return {[type]}       [description]
     */
    search(query) {
    };
}