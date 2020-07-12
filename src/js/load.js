import {select as d3select} from 'd3-selection';
import Controller from './controller';
//import ProfileLoader from './page_profile';   //emre - older
import ProfileLoader from "./profile/profile_loader";   //emre - newer
import {loadMenu} from './elements/menu';
import PDFPrinter from './print';
import {MapControl} from './map/maps';
import {numFmt} from './utils';
import {Profile} from './profile';
import {onProfileLoaded as onProfileLoadedSearch, Search} from './elements/search';
import {MapChip} from './elements/mapchip';
import {LocationInfoBox} from './elements/location_info_box';
import {LoadingSpinner} from './elements/loading_spinner';
import {PointData} from "./map/point_data";
import {ZoomToggle} from "./mapmenu/zoomtoggle";
import {PreferredChildToggle} from "./mapmenu/preferred_child_toggle";
import {ProfileLayout} from "./elements/profile_layout";
import {PointDataTray} from './elements/point_tray/tray';
import {API} from './api';
import Analytics from './analytics';

import "data-visualisations/src/charts/bar/reusable-bar-chart/stories.styles.css";
import "../css/barchart.css";
import {Popup} from "./map/popup";
import {TutorialBox} from "./elements/tutorial_box";

export default function configureApplication(serverUrl, profileId, config) {
    const api = new API(serverUrl);
    const controller = new Controller(api, config, profileId);
    if (config.analytics)
        config.analytics.registerEvents(controller);

    const mapcontrol = new MapControl(config);
    mapcontrol.popup = new Popup(mapcontrol.map);
    const pointData = new PointData(api, mapcontrol.map, profileId, config);
    const pointDataTray = new PointDataTray(api, profileId);
    const pdfprinter = new PDFPrinter();
    const printButton = $("#profile-print");
    const mapchip = new MapChip(config.choropleth);
    const search = new Search(api, profileId, 2);
    const profileLoader = new ProfileLoader(config, api, profileId);
    const locationInfoBox = new LocationInfoBox();
    const zoomToggle = new ZoomToggle();
    const preferredChildToggle = new PreferredChildToggle();
    const profileLayout = new ProfileLayout(serverUrl);
    const tutorialBox = new TutorialBox();

    // TODO not certain if it is need to register both here and in the controller in loadedGeography
    controller.registerWebflowEvents();

    configureMapEvents(controller, {mapcontrol: mapcontrol, zoomToggle: zoomToggle});
    configureSpinnerEvents(controller);
    configureSearchEvents(controller, search);
    configureInfoboxEvents(controller, locationInfoBox);
    configurePointDataEvents(controller, {pointData: pointData, pointDataTray: pointDataTray});
    configureChoroplethEvents(controller, {mapcontrol: mapcontrol, mapchip: mapchip});
    configureBreadcrumbsEvents(controller, {profileLoader: profileLoader, locationInfoBox: locationInfoBox});
    configureDataExplorerEvents(controller);
    configureProfileEvents(controller, {profileLoader: profileLoader});
    configureMiscElementEvents(controller, {
        profileLayout: profileLayout,
        tutorialBox: tutorialBox,
        pdfprinter: pdfprinter,
        printButton: printButton
    });

   

    controller.on('loadedNewProfile', payload => {
        // there seems to be a bug where menu items close if this is not set
        $(".sub-category__dropdown_wrapper a").attr("href", "#")
    })



    preferredChildToggle.on('preferredChildChange', payload => controller.onPreferredChildChange(payload))

    controller.triggerHashChange()
}

function configureDataExplorerEvents(controller) {
    controller.on('loadedNewProfile', payload => loadMenu(payload.payload.profile.profileData, payload => {
        controller.onSubIndicatorClick(payload)
    }))

}

function configureSpinnerEvents(controller) {
    const searchLoadSpinner = new LoadingSpinner($('.location__search_loading'));
    const contentMapSpinner = new LoadingSpinner('.breadcrumb__loading', {start: true}, true);

    controller.on("searchBefore", payload => searchLoadSpinner.start());
    controller.on("searchResults", payload => searchLoadSpinner.stop());
    controller.on("layerLoaded", payload => contentMapSpinner.stop());
}

function configureMapEvents(controller, objs = {mapcontrol: null, zoomToggle: null}) {
    const zoomToggle = objs['zoomToggle'];
    const mapcontrol = objs['mapcontrol'];

    controller.on('layerMouseOver', payload => mapcontrol.popup.loadPopup(payload.payload, payload.state));
    controller.on('layerMouseOut', payload => mapcontrol.popup.hidePopup(payload));
    controller.on('layerMouseMove', payload => mapcontrol.popup.updatePopupPosition(payload));
    controller.on('loadedNewProfile', payload => {
        const geography = payload.payload.profile.geography;
        const geometries = payload.payload.geometries;
        mapcontrol.overlayBoundaries(geography, geometries)
    });
    controller.on('zoomToggled', payload => mapcontrol.enableZoom(payload.payload.enabled));


    zoomToggle.on('zoomToggled', payload => controller.onZoomToggled(payload));
    mapcontrol.on('layerClick', payload => controller.onLayerClick(payload));
    mapcontrol.on('layerMouseOver', payload => controller.onLayerMouseOver(payload))
    mapcontrol.on('layerMouseOut', payload => controller.onLayerMouseOut(payload))
    mapcontrol.on("layerMouseMove", payload => controller.onLayerMouseMove(payload))
    mapcontrol.on('layerLoading', payload => controller.onLayerLoading(payload))
    mapcontrol.on('layerLoaded', payload => controller.onLayerLoaded(payload))
    mapcontrol.on('mapZoomed', payload => controller.onMapZoomed(payload))
}

function configureProfileEvents(controller, objs = {profileLoader: null}) {
    const profileLoader = objs['profileLoader'];

    controller.on('loadedNewProfile', payload => profileLoader.loadProfile(payload.payload))
}

function configureSearchEvents(controller, search) {
    controller.on('profileLoaded', onProfileLoadedSearch);

    search.on('beforeSearch', payload => controller.onSearchBefore(payload));
    search.on('searchResults', payload => controller.onSearchResults(payload));
    search.on('resultClick', payload => controller.onSearchResultClick(payload));
    search.on('clearSearch', payload => controller.onSearchClear(payload));
}

function configureMiscElementEvents(controller, objs = {
    profileLayout: null,
    tutorialBox: null,
    pdfprinter: null,
    printButton: null,
}) {

    const profileLayout = objs['profileLayout'];
    const tutorialBox = objs['tutorialBox'];
    const pdfprinter = objs['pdfprinter'];
    const printButton = objs['printButton'];

    printButton.on("click", payload => controller.onPrintProfile(payload));


    controller.on('loadedNewProfile', payload => profileLayout.displayLogo(payload.payload.logo))
    controller.on('loadedNewProfile', payload => tutorialBox.prepTutorialBox(payload.payload))
    controller.on('printProfile', payload => pdfprinter.printDiv(payload))
}

function configureInfoboxEvents(controller, locationInfoBox) {
    controller.on('profileLoaded', payload => locationInfoBox.update(payload.state.profile))
    controller.on('loadedNewProfile', payload => locationInfoBox.update(payload.payload))

    controller.on('layerClick', payload => {
        if (payload.state.mapLoading == true) {
            return
        }

        let properties = payload.payload.properties;
        let locations = [{
            name: properties.name,
            level: properties.level
        }];
        locationInfoBox.updateLocations(locations);
    })
}

function configurePointDataEvents(controller, objs = {pointDataTray: null, pointData: null}) {
    const pointDataTray = objs['pointDataTray'];
    const pointData = objs['pointData'];

    controller.on("categorySelected", payload => pointData.showCategoryPoint(payload.payload));
    controller.on("categoryUnselected", payload => pointData.removeCategoryPoints(payload.payload));
    controller.on("mapZoomed", payload => pointData.onMapZoomed(payload.payload));

    pointDataTray.on('themeSelected', payload => controller.onThemeSelected(payload))
    pointDataTray.on('themeUnselected', payload => controller.onThemeUnselected(payload))
    pointDataTray.on('themeLoaded', payload => controller.onThemePointLoaded(payload));
    pointDataTray.on('loadingThemes', payload => controller.onLoadingThemes(payload));
    pointDataTray.on('loadedThemes', payload => controller.onLoadedThemes(payload));
    pointDataTray.on('categorySelected', payload => controller.onCategorySelected(payload));
    pointDataTray.on('categoryUnselected', payload => controller.onCategoryUnselected(payload));

    pointData.on('loadingCategoryPoints', payload => controller.onCategoryPointLoading(payload));
    pointData.on('loadedCategoryPoints', payload => controller.onCategoryPointLoaded(payload));

    pointDataTray.loadThemes();
}

function configureChoroplethEvents(controller, objs = {mapcontrol: null, mapchip: null}) {
    const mapcontrol = objs['mapcontrol'];
    const mapchip = objs['mapchip'];

    mapcontrol.on('choropleth', payload => controller.onChoropleth(payload))
    mapchip.on('mapChipRemoved', payload => controller.onMapChipRemoved(payload));
    mapchip.on('choroplethFiltered', payload => {
        controller.onChoroplethFiltered(payload);
    })

        //let the choropleth persist
    controller.on('loadedNewProfile', payload => controller.handleNewProfileChoropleth())
    controller.on('mapChipRemoved', payload => mapcontrol.choropleth.reset(true));
    controller.on('choroplethFiltered', payload => {
        const pp = payload.payload;
        const ps = payload.state;
        mapcontrol.displayChoropleth(pp.data, pp.subindicatorArr, ps.subindicator.choropleth_method);
    })

    controller.on('newProfileWithChoropleth', payload => {
        setTimeout(() => {
            const pp = payload.payload;
            const ps = payload.state;
            mapcontrol.displayChoropleth(pp.data, pp.subindicatorArr, ps.subindicator.choropleth_method);

            if (typeof pp.indicators !== 'undefined') {
                //indicators changed -- trigger onSubIndicatorChange
                const args = {
                    indicators: pp.indicators,
                    subindicatorKey: ps.selectedSubindicator,
                    indicatorTitle: ps.subindicator.indicatorTitle,
                    filter: ps.subindicator.filter
                }

                mapchip.onSubIndicatorChange(args);
            }
        }, 0);
    })

    controller.on('choropleth', payload => mapchip.onChoropleth(payload.payload));
    controller.on('subindicatorClick', payload => {
        const ps = payload.state;
        const method = ps.subindicator.choropleth_method;
        mapcontrol.handleChoropleth(ps.subindicator, method)
    })

    controller.on('subindicatorClick', payload => {
        const pp = payload.payload;
        const args = {
            indicators: pp.indicators,
            subindicatorKey: pp.obj.keys,
            indicatorTitle: pp.indicatorTitle
        }

        mapchip.onSubIndicatorChange(args);
    });

}

function configureBreadcrumbsEvents(controller, objs = {profileLoader: null, locationInfoBox: null}) {
    const profileLoader = objs['profileLoader'];
    const locationInfoBox = objs['locationInfoBox'];

    profileLoader.on('breadcrumbSelected', payload => controller.onBreadcrumbSelected(payload))
    locationInfoBox.on('breadcrumbSelected', payload => controller.onBreadcrumbSelected(payload))
}