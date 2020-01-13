import {select as d3select} from 'd3-selection';
import Controller from './controller';
import loadProfile from './page_profile';
import {loadMenu} from './menu';
import {MapControl} from './maps';
import {getJSON, numFmt} from './utils';
import {Profile} from './profile';
import {onSubIndicatorChange} from './map_panel';
import {onProfileLoaded as onProfileLoadedSearch, Search} from './search';

import "data-visualisations/src/charts/bar/reusable-bar-chart/stories.styles.css";
import "../css/barchart.css";


var baseUrl = null;
const SACode = "ZA"
const controller = new Controller();
const mapcontrol = new MapControl(controller);
const search = new Search(2);

function loadGeography(payload) {
    var payload = payload.payload;
    const profileId = payload.profileId;
    const geographyId = payload.geographyId;

    const url = `${baseUrl}/api/v1/profiles/${profileId}/geographies/${geographyId}/`;
    getJSON(url).then((data) => {
        var profile = new Profile(data);

        controller.onProfileLoaded(profile);
        // TODO might want to consider turning these load functions into classes 
        loadMenu(data["indicators"], controller.onSubIndicatorClick);
        loadProfile(data);
        // TODO need to move this somewhere useful
        $(".d3-tip").css("z-index", 100);
        Webflow.require('ix2').init()
    })
}

function loadPopup(payload) {
    const state = payload.state;
    var payload = payload.payload;
    var popupLabel = payload.properties.name;
    var areaCode = payload.areaCode;

    if (state.subindicator != null) {
        const subindicators = state.subindicator.subindicators;
        const subindicator = state.subindicator.obj.key;
        const subindicatorValues = subindicators.filter(s => (s.key == subindicator));
        if (subindicatorValues.length > 0) {
            const subindicatorValue = subindicatorValues[0];
            for (const [geographyCode, count] of Object.entries(subindicatorValue.children)) {
                if (geographyCode == areaCode) {
                    const countFmt = numFmt(count);
                    popupLabel = `<strong>${popupLabel}</strong>`;
                    popupLabel += `<br>${state.subindicator.indicator} (${subindicatorValue.key}): ${countFmt}`;
                }
            }
        }
    }
    const popup = payload.layer.bindPopup(popupLabel).openPopup();

}

export default function load(serverUrl, profileId) {
    baseUrl = serverUrl;
    controller.on("hashChange", loadGeography);
    controller.on("choroplethUpdate", payload => mapcontrol.choropleth(payload.payload))
    controller.on("subindicatorClick", onSubIndicatorChange);
    controller.on("layerMouseOver", payload => loadPopup(payload));
    controller.on("profileLoaded", onProfileLoadedSearch);
    controller.on("geographySelected", payload => {mapcontrol.overlayBoundaries(payload.payload.mapItId)})
    controller.on("searchResultClick", payload => {
        // TODO MDB is South Africa-specific - need to figure out how to abstract
        // this away
        mapcontrol.overlayBoundaries(`MDB:${payload.payload.code}`)
    })

    mapcontrol.on("layerClick", controller.onLayerClick)
    mapcontrol.on("layerMouseOver", controller.onLayerMouseOver)
    mapcontrol.on("layerMouseOut", controller.onLayerMouseOut)

    search.on('beforeSearch', controller.onSearchBefore);
    search.on('searchResults', controller.onSearchResults);
    search.on('resultClick', controller.onSearchResultClick);
    search.on('clearSearch', controller.onSearchClear);

    controller.triggerHashChange()
    // TODO need to set this to the geography searched for
    mapcontrol.overlayBoundaries(null);
}
