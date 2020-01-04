import {select as d3select} from 'd3-selection';

var navSearch = d3select(".nav__search");

export function onProfileLoaded(payload) {
    var profile = payload.payload;
    navSearch.select(".search-chip .truncate").text(profile.getFullName());
}