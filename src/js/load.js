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

   

    controller.on('profile.loaded', payload => {
        // there seems to be a bug where menu items close if this is not set
        $(".sub-category__dropdown_wrapper a").attr("href", "#")
    })



    preferredChildToggle.on('preferredChildChange', payload => controller.onPreferredChildChange(payload))

    controller.triggerHashChange()
}

function configureDataExplorerEvents(controller) {
    controller.on('profile.loaded', payload => loadMenu(payload.payload.profile.profileData, payload => {
        controller.onSubIndicatorClick(payload)
    }))

}

function configureSpinnerEvents(controller) {
    const searchLoadSpinner = new LoadingSpinner($('.location__search_loading'));
    const contentMapSpinner = new LoadingSpinner('.breadcrumb__loading', {start: true}, true);

    controller.on("search.before", payload => searchLoadSpinner.start());
    controller.on("search.results", payload => searchLoadSpinner.stop());
    controller.on("layerLoaded", payload => contentMapSpinner.stop());
}

function configureMapEvents(controller, objs = {mapcontrol: null, zoomToggle: null}) {
    const zoomToggle = objs['zoomToggle'];
    const mapcontrol = objs['mapcontrol'];

    controller.on('layer.mouse.over', payload => mapcontrol.popup.loadPopup(payload.payload, payload.state));
    controller.on('layer.mouse.out', payload => mapcontrol.popup.hidePopup(payload));
    controller.on('layer.mouse.move', payload => mapcontrol.popup.updatePopupPosition(payload));
    controller.on('profile.loaded', payload => {
        const geography = payload.payload.profile.geography;
        const geometries = payload.payload.geometries;
        mapcontrol.overlayBoundaries(geography, geometries)
    });


    controller.bubbleEvent(zoomToggle, 'zoomToggled');
    controller.bubbleEvents(mapcontrol, [
        'layer.mouse.over', 'layer.mouse.out', 'layer.mouse.move',
        'map.layer.loading', 'map.zoomed'
    ])
    mapcontrol.on('map.layer.loaded', payload => controller.onLayerLoaded(payload))
    mapcontrol.on('layerClick', payload => controller.onLayerClick(payload));
    controller.on('zoomToggled', payload => mapcontrol.enableZoom(payload.payload.enabled));
}

function configureProfileEvents(controller, objs = {profileLoader: null}) {
    const profileLoader = objs['profileLoader'];

    controller.on('profile.loaded', payload => profileLoader.loadProfile(payload.payload))
    controller.bubbleEvent(profileLoader, 'profile.chart.saveAsPng');
}

function configureSearchEvents(controller, search) {
    controller.on('profileLoaded', onProfileLoadedSearch);

    search.on('search.resultClick', payload => controller.onSearchResultClick(payload));
    controller.bubbleEvents(search, ['search.before', 'search.results', 'search.clear'])
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


    controller.on('profile.loaded', payload => profileLayout.displayLogo(payload.payload.logo))
    controller.on('profile.loaded', payload => tutorialBox.prepTutorialBox(payload.payload))
    controller.on('printProfile', payload => pdfprinter.printDiv(payload))

    // Choropleth filter toggle
    $('.filters__header_toggle').click(() => {
        controller.triggerEvent('mapchip.toggle');
    }) 

    // Rich data panel
    $('.rich-data-toggles .panel-toggle:nth-child(1)').click(() => {
        controller.triggerEvent('panel.rich_data.closed');
    }) 

    $('.rich-data-toggles .panel-toggle:nth-child(2)').click(() => {
        controller.triggerEvent('panel.point_mapper.opened');
        controller.triggerEvent('panel.rich_data.closed');
    }) 

    $('.rich-data-toggles .panel-toggle:nth-child(3)').click(() => {
        controller.triggerEvent('panel.data_mapper.opened');
        controller.triggerEvent('panel.rich_data.closed');
    }) 

    // Point data panel
    $('.point-mapper-toggles .panel-toggle:nth-child(1)').click(() => {
        controller.triggerEvent('panel.rich_data.opened');
        controller.triggerEvent('panel.point_mapper.closed');
    }) 

    $('.point-mapper-toggles .panel-toggle:nth-child(2)').click(() => {
        controller.triggerEvent('panel.point_mapper.closed');
    }) 

    $('.point-mapper-toggles .panel-toggle:nth-child(3)').click(() => {
        controller.triggerEvent('panel.data_mapper.opened');
        controller.triggerEvent('panel.point_mapper.closed');
    }) 


    $('.data-mapper-toggles .panel-toggle:nth-child(1)').click(() => {
        controller.triggerEvent('panel.rich_data.opened');
        controller.triggerEvent('panel.rich_data.closed');
    }) 


    // Data mapper panel 
    $('.data-mapper-toggles .panel-toggle:nth-child(1)').click(() => {
        controller.triggerEvent('panel.rich_data.opened');
        controller.triggerEvent('panel.data_mapper.closed');
    }) 

    $('.data-mapper-toggles .panel-toggle:nth-child(2)').click(() => {
        controller.triggerEvent('panel.point_mapper.opened');
        controller.triggerEvent('panel.data_mapper.closed');
    }) 

    $('.data-mapper-toggles .panel-toggle:nth-child(3)').click(() => {
        controller.triggerEvent('panel.data_mapper.closed');
    }) 

    // All panels
    $('.panel-toggles .panel-toggle:nth-child(1)').click(() => {
        controller.triggerEvent('panel.rich_data.opened');
    }) 

    $('.panel-toggles .panel-toggle:nth-child(2)').click(() => {
        controller.triggerEvent('panel.point_data.opened');
    }) 

    $('.panel-toggles .panel-toggle:nth-child(3)').click(() => {
        controller.triggerEvent('panel.data_mapper.opened');
    }) 

}

function configureInfoboxEvents(controller, locationInfoBox) {
    controller.on('profileLoaded', payload => locationInfoBox.update(payload.state.profile))
    controller.on('profile.loaded', payload => locationInfoBox.update(payload.payload))

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

    controller.on("point_tray.category.selected", payload => pointData.showCategoryPoint(payload.payload));
    controller.on("point_tray.category.unselected", payload => pointData.removeCategoryPoints(payload.payload));
    controller.on("map.zoomed", payload => pointData.onMapZoomed(payload.payload));

    controller.bubbleEvents(pointDataTray, [
        'point_tray.theme.selected', 'point_tray.theme.unselected',
        'point_tray.tray.loading_themes', 'point_tray.tray.themes_loaded',
        'point_tray.category.selected', 'point_tray.category.unselected',
        'themeLoaded'
    ])

    controller.bubbleEvents(pointData, ['loadedCategoryPoints', 'loadingCategoryPoints']);

    pointDataTray.loadThemes();
}

function configureChoroplethEvents(controller, objs = {mapcontrol: null, mapchip: null}) {
    const mapcontrol = objs['mapcontrol'];
    const mapchip = objs['mapchip'];

    mapchip.on('mapchip.removed', payload => controller.onMapChipRemoved(payload));
    mapchip.on('mapchip.choropleth.filtered', payload => {
        controller.onChoroplethFiltered(payload);
    })

        //let the choropleth persist
    controller.on('profile.loaded', payload => controller.handleNewProfileChoropleth())
    controller.on('mapchip.removed', payload => mapcontrol.choropleth.reset(true));
    controller.bubbleEvents(mapcontrol, ['map.choropleth.display', 'map.choropleth.reset']);

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

    controller.on('map.choropleth.display', payload => mapchip.onChoropleth(payload.payload));
    controller.on('map_explorer.subindicator.click', payload => {
        const ps = payload.state;
        const method = ps.subindicator.choropleth_method;
        mapcontrol.handleChoropleth(ps.subindicator, method)
    })

    controller.on('map_explorer.subindicator.click', payload => {
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

    controller.bubbleEvents(profileLoader, ['profile.breadcrumbs.selected', 'profile.nav.clicked']);
    controller.bubbleEvent(locationInfoBox, 'location_infobox.breadcrumbs.selected');
    profileLoader.on('profile.breadcrumbs.selected', payload => controller.onBreadcrumbSelected(payload))
    locationInfoBox.on('location_infobox.breadcrumbs.selected', payload => controller.onBreadcrumbSelected(payload))
}