import {select as d3select} from 'd3-selection';
import Controller from './controller';
import loadProfile from './page_profile';
import {loadMenu} from './menu';
import PDFPrinter from './print';
import {MapControl} from './maps';
import {getJSON, numFmt} from './utils';
import {Profile} from './profile';
import {onProfileLoaded as onProfileLoadedSearch, Search} from './search';
import {MapItGeographyProvider} from './geography_providers/mapit';
import {WazimapProvider} from './geography_providers/wazimap';
import {MapChip} from './mapchip';

import "data-visualisations/src/charts/bar/reusable-bar-chart/stories.styles.css";
import "../css/barchart.css";


function loadGeography(baseUrl, controller, payload) {
    var payload = payload.payload;
    const profileId = payload.profileId;
    const geographyId = payload.geographyId;

    const url = `${baseUrl}/profiles/${profileId}/geographies/${geographyId}/`;
    getJSON(url).then((data) => {
        var profile = new Profile(data);

        controller.onProfileLoaded(profile);
        // TODO might want to consider turning these load functions into classes 
        // TODO need to change this to trigger an event
        loadMenu(data["indicators"], payload => controller.onSubIndicatorClick(payload));
        loadProfile(data);
        // TODO need to move this somewhere useful
        $(".d3-tip").css("z-index", 100);
        Webflow.require('ix2').init()
        controller.registerWebflowEvents();
    })
}

function loadPopup(payload) {
    const state = payload.state;
    var payload = payload.payload;
    var popupLabel = payload.properties.name;
    var areaCode = payload.areaCode;
    const popup = L.popup({autoPan: false})

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
    popup.setContent(popupLabel)
    payload.layer.bindPopup(popup).openPopup();

}

export default function load(serverUrl, profileId) {
    const baseUrl = `${serverUrl}/api/v1`;
    const SACode = "ZA"
    const geographyProvider = new WazimapProvider(baseUrl)
    //const geographyProvider = new MapItGeographyProvider()
    const mapcontrol = new MapControl(geographyProvider);
    const controller = new Controller();
    const pdfprinter = new PDFPrinter();
    const printButton = $("#profile-print");
    const mapchip = new MapChip();
    const search = new Search(2);

    controller.registerWebflowEvents();
    controller.on("hashChange", payload => loadGeography(baseUrl, controller, payload));
    controller.on("subindicatorClick", payload => mapcontrol.choropleth(payload.payload))
    controller.on("subindicatorClick", payload => mapchip.onSubIndicatorChange(payload.payload));
    controller.on("layerMouseOver", payload => loadPopup(payload));
    controller.on("profileLoaded", onProfileLoadedSearch);
    controller.on("printProfile", payload => pdfprinter.printDiv(payload))
    controller.on("searchResultClick", payload => mapcontrol.overlayBoundaries(payload.payload.code, false))

    mapcontrol.on("layerClick", payload => controller.onLayerClick(payload))
    mapcontrol.on("layerMouseOver", payload => controller.onLayerMouseOver(payload))
    mapcontrol.on("layerMouseOut", payload => controller.onLayerMouseOut(payload))

    search.on('beforeSearch', payload => controller.onSearchBefore(payload));
    search.on('searchResults', payload => controller.onSearchResults(payload));
    search.on('resultClick', payload => controller.onSearchResultClick(payload));
    search.on('clearSearch', payload => controller.onSearchClear(payload));

    printButton.on("click", payload => controller.onPrintProfile(payload));
	
	mapchip.on("mapChipRemoved", payload => controller.onMapChipRemoved(payload));

    controller.triggerHashChange()
    // TODO need to set this to the geography searched for
    mapcontrol.overlayBoundaries(null);
}
