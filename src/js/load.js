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
import {LoadingSpinner} from './loading_spinner';
import {PointData} from "./point_data";

import "data-visualisations/src/charts/bar/reusable-bar-chart/stories.styles.css";
import "../css/barchart.css";

export default function configureApplication(serverUrl, profileId) {
    const baseUrl = `${serverUrl}/api/v1`;
    const SACode = "ZA"
    const geographyProvider = new WazimapProvider(baseUrl)
    const mapcontrol = new MapControl(geographyProvider);
    const pointData = new PointData(mapcontrol.map);
    const controller = new Controller();
    const pdfprinter = new PDFPrinter();
    const printButton = $("#profile-print");
    const mapchip = new MapChip();
    const search = new Search(baseUrl, 2);
    const geographyLoader = new GeographyLoader(baseUrl, mapcontrol);
    const profileLoader = new ProfileLoader();
    const locationInfoBox = new LocationInfoBox();
    const searchLoadSpinner = new LoadingSpinner($('.location__search_loading'));
    const contentMapSpinner = new LoadingSpinner($('.content__map_loading'), {start: true});

    $('.content__rich-data_toggle').click(() => controller.onRichDataDrawer({opening: true}));
    $('.content__rich-data--close').click(() => controller.onRichDataDrawer({opening: false}));

    // TODO not certain if it is need to register both here and in the controller in loadedGeography
    controller.registerWebflowEvents();
    controller.on('hashChange', payload => geographyLoader.loadGeography(payload.payload.geography, payload.payload.profile, payload.payload.zoomNecessary));
    controller.on('breadcrumbSelected', payload => geographyLoader.loadGeography(payload.payload.code, payload.state.profile));
    controller.on('subindicatorClick', payload => mapcontrol.choropleth(payload.payload))
    controller.on('subindicatorClick', payload => mapchip.onSubIndicatorChange(payload.payload));
    controller.on('layerMouseOver', payload => mapcontrol.loadPopup(payload));
    controller.on('profileLoaded', onProfileLoadedSearch);
    controller.on('printProfile', payload => pdfprinter.printDiv(payload))
    controller.on('profileLoaded', payload => locationInfoBox.update(payload.state.profile))

    controller.on('searchResultClick', payload => mapcontrol.overlayBoundaries(payload.payload.code, false))

    controller.on('richDataDrawerOpen', payload => mapcontrol.onSizeUpdate(payload))
    controller.on('richDataDrawerClose', payload => mapcontrol.onSizeUpdate(payload))

    controller.on('loadedGeography', payload => profileLoader.loadProfile(payload))
    controller.on('loadedGeography', payload => {
        const data = payload.payload.profile.data;
        // TODO this needs to be cleaned up
        loadMenu(data['indicators'], payload => controller.onSubIndicatorClick(payload));
    })
    controller.on('loadedGeography', payload => locationInfoBox.update(payload.payload.profile))
    controller.on("searchBefore", payload => searchLoadSpinner.start());
    controller.on("searchResults", payload => searchLoadSpinner.stop());
    controller.on("layerLoading", payload => contentMapSpinner.start());
    controller.on("layerLoadingDone", payload => contentMapSpinner.stop());
    controller.on("themeSelected", payload => {
        new LoadingSpinner($(payload.payload.item).find('.point-data__h2_loading'), {start: true})
    });
    controller.on("themeUnselected", payload => {
        new LoadingSpinner($(payload.payload.item).find('.point-data__h2_loading'), {stop: true})
        new LoadingSpinner($(payload.payload.item).find('.point-data__h2_load-complete'), {stop: true})
    });

    controller.on("themePointLoaded", payload => {
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

    geographyLoader.on('loadingGeography', payload => controller.onLoadingGeography(payload))
    geographyLoader.on('loadedGeography', payload => controller.onLoadedGeography(payload))

    pointData.on("themeSelected", payload => controller.onThemeSelected(payload))
    pointData.on("themeUnselected", payload => controller.onThemeUnselected(payload))
    pointData.on("themePointLoaded", payload => controller.onThemePointLoaded(payload));
    pointData.on("loadingThemes", payload => controller.onLoadingThemes(payload));
    pointData.on("loadedThemes", payload => controller.onLoadedThemes(payload));
    pointData.on("categorySelected", payload => controller.onCategorySelected(payload));
    pointData.on("categoryUnselected", payload => controller.onCategoryUnselected(payload));
    pointData.on("categoryPointLoaded", payload => controller.onCategoryPointLoaded(payload));

    pointData.loadThemes();
    controller.triggerHashChange()
    mapcontrol.overlayBoundaries(null);
}
