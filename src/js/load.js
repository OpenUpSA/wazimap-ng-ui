import {select as d3select} from 'd3-selection';
import Controller from './controller';
import ProfileLoader  from './page_profile';
import {loadMenu} from './menu';
import PDFPrinter from './print';
import {MapControl} from './maps';
import {getJSON, numFmt} from './utils';
import {Profile} from './profile';
import {onProfileLoaded as onProfileLoadedSearch, Search} from './search';
import {MapItGeographyProvider} from './geography_providers/mapit';
import {WazimapProvider} from './geography_providers/wazimap';
import {MapChip} from './mapchip';
import {GeographyLoader} from './geography_loader';
import {LocationInfoBox} from './location_info_box';

import "data-visualisations/src/charts/bar/reusable-bar-chart/stories.styles.css";
import "../css/barchart.css";


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
    const mapcontrol = new MapControl(geographyProvider);
    const controller = new Controller();
    const pdfprinter = new PDFPrinter();
    const printButton = $("#profile-print");
    const mapchip = new MapChip();
    const search = new Search(baseUrl, 2);
    const geographyLoader = new GeographyLoader(baseUrl, mapcontrol);
    const profileLoader = new ProfileLoader();
    const locationInfoBox = new LocationInfoBox();

    $('.content__rich-data_toggle').click(() => controller.onRichDataDrawer({opening: true}));
    $('.content__rich-data--close').click(() => controller.onRichDataDrawer({opening: false}));

    // TODO not certain if it is need to register both here and in the controller in loadedGeography
    controller.registerWebflowEvents();
    controller.on('hashChange', payload => geographyLoader.loadGeography(payload.payload.geography, payload.payload.profile));
    controller.on('breadcrumbSelected', payload => geographyLoader.loadGeography(payload.payload.code, payload.state.profile));

    controller.on('subindicatorClick', payload => mapcontrol.choropleth(payload.payload))
    controller.on('subindicatorClick', payload => mapchip.onSubIndicatorChange(payload.payload));
    controller.on('layerMouseOver', payload => loadPopup(payload));
    controller.on('profileLoaded', onProfileLoadedSearch);
    controller.on('printProfile', payload => pdfprinter.printDiv(payload))
    controller.on('searchResultClick', payload => mapcontrol.overlayBoundaries(payload.payload.code, false))
    controller.on('richDataDrawerOpen', payload => mapcontrol.onSizeUpdate(payload))
    controller.on('richDataDrawerClose', payload => mapcontrol.onSizeUpdate(payload))
    controller.on('loadedGeography', payload => profileLoader.loadProfile(payload))
    controller.on('loadedGeography', payload => {
        const data = payload.payload.profile.data;
        loadMenu(data['indicators'], payload => controller.onSubIndicatorClick(payload));
    })
    controller.on('loadedGeography', payload => {
        const geographies = payload.payload.profile.data.geography;
        const currentGeography = {code: geographies.code, level: geographies.level, name: geographies.name}
        const locations = [...geographies.parents, currentGeography]

        locationInfoBox.updateInfo(locations)
    })

    mapcontrol.on("layerClick", payload => controller.onLayerClick(payload))
    mapcontrol.on("layerMouseOver", payload => controller.onLayerMouseOver(payload))
    mapcontrol.on("layerMouseOut", payload => controller.onLayerMouseOut(payload))

    search.on('beforeSearch', payload => controller.onSearchBefore(payload));
    search.on('searchResults', payload => controller.onSearchResults(payload));
    search.on('resultClick', payload => controller.onSearchResultClick(payload));
    search.on('clearSearch', payload => controller.onSearchClear(payload));


    printButton.on("click", payload => controller.onPrintProfile(payload));
    locationInfoBox.on('breadcrumbSelected', payload => controller.onBreadcrumbSelected(payload))
	
	mapchip.on('mapChipRemoved', payload => controller.onMapChipRemoved(payload));

    geographyLoader.on('loadingGeography', payload => controller.onLoadingGeography(payload))
    geographyLoader.on('loadedGeography', payload => controller.onLoadedGeography(payload))


    controller.triggerHashChange()
    mapcontrol.overlayBoundaries(null);
}
