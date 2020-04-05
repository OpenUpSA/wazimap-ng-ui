import {select as d3select} from 'd3-selection';
import Controller from './controller';
import ProfileLoader from './page_profile';
import {loadMenu} from './elements/menu';
import PDFPrinter from './print';
import {MapControl} from './map/maps';
import {getJSON, numFmt} from './utils';
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

import "data-visualisations/src/charts/bar/reusable-bar-chart/stories.styles.css";
import "../css/barchart.css";
import {Popup} from "./map/popup";

export default function configureApplication(serverUrl, profileId, config) {
    const baseUrl = `${serverUrl}/api/v1`;
    const mapcontrol = new MapControl(config);
    const popup = new Popup(mapcontrol.map);
    const pointData = new PointData(baseUrl, mapcontrol.map, profileId, config);
    const pointDataTray = new PointDataTray(baseUrl, profileId);
    const controller = new Controller(baseUrl, config, profileId);
    const pdfprinter = new PDFPrinter();
    const printButton = $("#profile-print");
    const mapchip = new MapChip(config.choropleth);
    const search = new Search(baseUrl, profileId, 2);
    const profileLoader = new ProfileLoader(config);
    const locationInfoBox = new LocationInfoBox();
    const zoomToggle = new ZoomToggle();
    const preferredChildToggle = new PreferredChildToggle();
    const profileLayout = new ProfileLayout(serverUrl);
    const searchLoadSpinner = new LoadingSpinner($('.location__search_loading'));
    const contentMapSpinner = new LoadingSpinner('.breadcrumb__loading', {start: true}, true);

    $('.content__rich-data_toggle').click(() => controller.onRichDataDrawer({opening: true}));
    $('.content__rich-data--close').click(() => controller.onRichDataDrawer({opening: false}));

    // TODO not certain if it is need to register both here and in the controller in loadedGeography
    controller.registerWebflowEvents();
    controller.on('subindicatorClick', payload => {
        const method = payload.state.subindicator.obj.choropleth_method;
        mapcontrol.displayChoropleth(payload.state.subindicator, method)
    })
    controller.on('subindicatorClick', payload => mapchip.onSubIndicatorChange(payload.payload));
    controller.on('choropleth', payload => mapchip.onChoropleth(payload.payload));
    controller.on('layerMouseOver', payload => {
        popup.loadPopup(payload.payload, payload.state)
    });
    controller.on('layerMouseOut', payload => popup.hidePopup(payload));
    controller.on('layerMouseMove', payload => {
        popup.updatePopupPosition(payload)
    });
    controller.on('profileLoaded', onProfileLoadedSearch);
    controller.on('profileLoaded', payload => locationInfoBox.update(payload.state.profile))
    controller.on('printProfile', payload => pdfprinter.printDiv(payload))


    controller.on('richDataDrawerOpen', payload => mapcontrol.onSizeUpdate(payload))
    controller.on('richDataDrawerClose', payload => mapcontrol.onSizeUpdate(payload))

    controller.on("loadedNewProfile", payload => mapchip.removeMapChip());
    controller.on('loadedNewProfile', payload => locationInfoBox.update(payload.payload))
    controller.on('loadedNewProfile', payload => loadMenu(payload.payload.profile.profileData, payload => {
        controller.onSubIndicatorClick(payload)
    }))
    controller.on('loadedNewProfile', payload => profileLoader.loadProfile(payload.payload))
    controller.on('loadedNewProfile', payload => {
        const geography = payload.payload.profile.geography;
        const geometries = payload.payload.geometries;
        mapcontrol.overlayBoundaries(geography, geometries)
    });

    controller.on('loadedNewProfile', payload => profileLayout.displayLogo(payload.payload.logo))

    controller.on("searchBefore", payload => searchLoadSpinner.start());
    controller.on("searchResults", payload => searchLoadSpinner.stop());
    controller.on("layerLoadingDone", payload => contentMapSpinner.stop());

    controller.on("categorySelected", payload => pointData.showCategoryPoint(payload.payload));
    controller.on("categoryUnselected", payload => pointData.removeCategoryPoints(payload.payload));
    controller.on("mapZoomed", payload => pointData.onMapZoomed(payload.payload));

    controller.on('mapChipRemoved', payload => mapcontrol.resetChoropleth());
    controller.on('zoomToggled', payload => {
        mapcontrol.enableZoom(payload.payload.enabled)
    });

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

    mapcontrol.on('layerClick', payload => controller.onLayerClick(payload));
    mapcontrol.on('layerMouseOver', payload => controller.onLayerMouseOver(payload))
    mapcontrol.on('layerMouseOut', payload => controller.onLayerMouseOut(payload))
    mapcontrol.on("layerMouseMove", payload => controller.onLayerMouseMove(payload))
    mapcontrol.on('layerLoading', payload => controller.onLayerLoading(payload))
    mapcontrol.on('layerLoadingDone', payload => controller.onLayerLoadingDone(payload))
    mapcontrol.on('mapZoomed', payload => controller.onMapZoomed(payload))
    mapcontrol.on('choropleth', payload => controller.onChoropleth(payload))


    search.on('beforeSearch', payload => controller.onSearchBefore(payload));
    search.on('searchResults', payload => controller.onSearchResults(payload));
    search.on('resultClick', payload => controller.onSearchResultClick(payload));
    search.on('clearSearch', payload => controller.onSearchClear(payload));


    printButton.on("click", payload => controller.onPrintProfile(payload));
    locationInfoBox.on('breadcrumbSelected', payload => controller.onBreadcrumbSelected(payload))

    mapchip.on('mapChipRemoved', payload => controller.onMapChipRemoved(payload));

    pointDataTray.on('themeSelected', payload => controller.onThemeSelected(payload))
    pointDataTray.on('themeUnselected', payload => controller.onThemeUnselected(payload))
    pointDataTray.on('themeLoaded', payload => controller.onThemePointLoaded(payload));
    pointDataTray.on('loadingThemes', payload => controller.onLoadingThemes(payload));
    pointDataTray.on('loadedThemes', payload => controller.onLoadedThemes(payload));
    pointDataTray.on('categorySelected', payload => controller.onCategorySelected(payload));
    pointDataTray.on('categoryUnselected', payload => controller.onCategoryUnselected(payload));

    // pointData.on('categoryPointLoaded', payload => controller.onCategoryPointLoaded(payload));


    pointDataTray.loadThemes();

    zoomToggle.on('zoomToggled', payload => controller.onZoomToggled(payload));
    preferredChildToggle.on('preferredChildChange', payload => controller.onPreferredChildChange(payload))

    controller.triggerHashChange()
    // mapcontrol.overlayBoundaries(null);
}
