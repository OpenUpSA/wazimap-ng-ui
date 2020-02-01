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
import {LocationInfoBox} from './location_info_box';
import {LoadingSpinner} from './loading_spinner';
import {PointData} from "./point_data";
import {ZoomToggle} from "./mapmenu/zoomtoggle";

import "data-visualisations/src/charts/bar/reusable-bar-chart/stories.styles.css";
import "../css/barchart.css";

export default function configureApplication(serverUrl, profileId) {
    const baseUrl = `${serverUrl}/api/v1`;
    const SACode = "ZA"
    const geographyProvider = new WazimapProvider(baseUrl)
    const mapcontrol = new MapControl(geographyProvider);
    const pointData = new PointData(baseUrl, mapcontrol.map);
    const controller = new Controller(baseUrl, profileId);
    const pdfprinter = new PDFPrinter();
    const printButton = $("#profile-print");
    const mapchip = new MapChip();
    const search = new Search(baseUrl, 2);
    const profileLoader = new ProfileLoader();
    const locationInfoBox = new LocationInfoBox();
    const zoomToggle = new ZoomToggle();
    const searchLoadSpinner = new LoadingSpinner($('.location__search_loading'));
    const contentMapSpinner = new LoadingSpinner($('.content__map_loading'), {start: true});

    $('.content__rich-data_toggle').click(() => controller.onRichDataDrawer({opening: true}));
    $('.content__rich-data--close').click(() => controller.onRichDataDrawer({opening: false}));

    // TODO not certain if it is need to register both here and in the controller in loadedGeography
    controller.registerWebflowEvents();
    controller.on('subindicatorClick', payload => mapcontrol.choropleth(payload))
    controller.on('subindicatorClick', payload => mapchip.onSubIndicatorChange(payload.payload));
    controller.on('layerMouseOver', payload => mapcontrol.loadPopup(payload));
    controller.on('profileLoaded', onProfileLoadedSearch);
    controller.on('profileLoaded', payload => locationInfoBox.update(payload.state.profile))
    controller.on('printProfile', payload => pdfprinter.printDiv(payload))


    controller.on('richDataDrawerOpen', payload => mapcontrol.onSizeUpdate(payload))
    controller.on('richDataDrawerClose', payload => mapcontrol.onSizeUpdate(payload))

    controller.on("loadingNewProfile", payload => contentMapSpinner.start());
    controller.on("loadedNewProfile", payload => mapchip.clearAllMapChip());
    controller.on('loadedNewProfile', payload => locationInfoBox.update(payload.payload.profile))
    controller.on('loadedNewProfile', payload => loadMenu(payload.payload.profile['indicators'], payload => controller.onSubIndicatorClick(payload)))
    controller.on('loadedNewProfile', payload => profileLoader.loadProfile(payload))
    controller.on('loadedNewProfile', payload => mapcontrol.overlayBoundaries(payload))

    controller.on("searchBefore", payload => searchLoadSpinner.start());
    controller.on("searchResults", payload => searchLoadSpinner.stop());
    controller.on("layerLoadingDone", payload => contentMapSpinner.stop());
    controller.on("themeSelected", payload => {
        new LoadingSpinner($(payload.payload.item).find('.point-data__h2_loading'), {start: true})
    });
    controller.on("themeUnselected", payload => {
        new LoadingSpinner($(payload.payload.item).find('.point-data__h2_loading'), {stop: true})
        new LoadingSpinner($(payload.payload.item).find('.point-data__h2_load-complete'), {stop: true})
    });

    controller.on("themeLoaded", payload => {
        if(payload.payload.data == "cancel")
        {
            new LoadingSpinner($(payload.payload.item).find('.point-data__h2_loading'), {stop: true})
            new LoadingSpinner($(payload.payload.item).find('.point-data__h2_load-complete'), {stop: true})
            return;
        }
            
        new LoadingSpinner($(payload.payload.item).find('.point-data__h2_loading'), {stop: true})
        new LoadingSpinner($(payload.payload.item).find('.point-data__h2_load-complete'), {start: true})
    });
    
    controller.on("categorySelected", payload => {
        new LoadingSpinner($(payload.payload.item).find('.point-data__h2_loading'), {start: true})
        new LoadingSpinner($(payload.payload.item).find('.point-data__h2_load-complete'), {stop: true})
    });
    
    controller.on("categoryUnselected", payload => {
        new LoadingSpinner($(payload.payload.item).find('.point-data__h2_loading'), {stop: true})
        new LoadingSpinner($(payload.payload.item).find('.point-data__h2_load-complete'), {stop: true})
    });
    
    controller.on("categoryPointLoaded", payload => {
        new LoadingSpinner($(payload.payload.item).find('.point-data__h2_loading'), {stop: true})
        new LoadingSpinner($(payload.payload.item).find('.point-data__h2_load-complete'), {start: true})
    });
    
    controller.on("mapChipRemoved", payload => mapcontrol.resetChoropleth());
    controller.on("zoomToggled", payload => {
        mapcontrol.enableZoom(payload.payload.enabled)
    });

    mapcontrol.on("layerClick", payload => controller.onLayerClick(payload))
    mapcontrol.on("layerMouseOver", payload => controller.onLayerMouseOver(payload))
    mapcontrol.on("layerMouseOut", payload => controller.onLayerMouseOut(payload))
    mapcontrol.on("layerLoading", payload => controller.onLayerLoading(payload))
    mapcontrol.on("layerLoadingDone", payload => controller.onLayerLoadingDone(payload))

    search.on('beforeSearch', payload => controller.onSearchBefore(payload));
    search.on('searchResults', payload => controller.onSearchResults(payload));
    search.on('resultClick', payload => controller.onSearchResultClick(payload));
    search.on('clearSearch', payload => controller.onSearchClear(payload));


    printButton.on("click", payload => controller.onPrintProfile(payload));
    locationInfoBox.on('breadcrumbSelected', payload => controller.onBreadcrumbSelected(payload))

    mapchip.on('mapChipRemoved', payload => controller.onMapChipRemoved(payload));

    pointData.on("themeSelected", payload => controller.onThemeSelected(payload))
    pointData.on("themeUnselected", payload => controller.onThemeUnselected(payload))
    pointData.on("themeLoaded", payload => controller.onThemePointLoaded(payload));
    pointData.on("loadingThemes", payload => controller.onLoadingThemes(payload));
    pointData.on("loadedThemes", payload => controller.onLoadedThemes(payload));
    pointData.on("categorySelected", payload => controller.onCategorySelected(payload));
    pointData.on("categoryUnselected", payload => controller.onCategoryUnselected(payload));
    pointData.on("categoryPointLoaded", payload => controller.onCategoryPointLoaded(payload));
    
    pointData.loadThemes();

    zoomToggle.on("zoomToggled", payload => controller.onZoomToggled(payload));
    
    controller.triggerHashChange()
    // mapcontrol.overlayBoundaries(null);
}
