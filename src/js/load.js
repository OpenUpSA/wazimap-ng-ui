import {select as d3select} from 'd3-selection';
import Controller from './controller';
import ProfileLoader from "./profile/profile_loader";
import {MapControl} from './map/maps';
import {numFmt} from './utils';
import {Profile} from './profile';
import {onProfileLoaded as onProfileLoadedSearch, Search} from './elements/search';
import {MapChip} from './elements/mapchip';
import {LocationInfoBox} from './elements/location_info_box';
import {PointData} from "./map/point_data";
import {ZoomToggle} from "./mapmenu/zoomtoggle";
import {PreferredChildToggle} from "./mapmenu/preferred_child_toggle";
import {PointDataTray} from './elements/point_tray/tray';
import {API} from './api';
import Analytics from './analytics';
import {BoundaryTypeBox} from "./map/boundary_type_box";
import {MapDownload} from "./map/map_download";

import "data-visualisations/src/charts/bar/reusable-bar-chart/stories.styles.css";
import "../css/barchart.css";
import {Popup} from "./map/popup";

import {configureBreadcrumbsEvents} from './setup/breadcrumbs';
import {configureChoroplethEvents} from './setup/choropleth';
import {configurePointDataEvents} from './setup/pointdata';
import {configureInfoboxEvents} from './setup/infobox';
import {configureMiscElementEvents} from './setup/miscelements';
import {configureSearchEvents} from './setup/search';
import {configureMapEvents} from './setup/map';
import {configureSpinnerEvents} from './setup/spinner';
import {configureDataExplorerEvents} from './setup/dataexplorer';
import {configureProfileEvents} from './setup/profile';
import {configureBoundaryEvents} from "./setup/boundaryevents";


export default function configureApplication(profileId, config) {
    const serverUrl = config.baseUrl;

    const api = config.api;
    const controller = new Controller(api, config, profileId);
    if (config.analytics)
        config.analytics.registerEvents(controller);

    let defaultFormattingConfig = {
        decimal: ",.1f",
        integer: ",.2d",
        percentage: ".1%"
    }
    let serverFormattingConfig = config.config.formatting;
    let formattingConfig = {...defaultFormattingConfig, ...serverFormattingConfig};

    const mapcontrol = new MapControl(config);
    mapcontrol.popup = new Popup(formattingConfig, mapcontrol.map);
    const pointData = new PointData(api, mapcontrol.map, profileId, config);
    const pointDataTray = new PointDataTray(api, profileId);
    const mapchip = new MapChip(config.choropleth);
    const search = new Search(api, profileId, 2);
    const profileLoader = new ProfileLoader(formattingConfig, api, profileId);
    const locationInfoBox = new LocationInfoBox(formattingConfig);
    const zoomToggle = new ZoomToggle();
    const preferredChildToggle = new PreferredChildToggle();
    const boundaryTypeBox = new BoundaryTypeBox(config.config.preferred_children);
    const mapDownload = new MapDownload(mapchip);

    // TODO not certain if it is need to register both here and in the controller in loadedGeography
    // controller.registerWebflowEvents();

    configureMapEvents(controller, {mapcontrol: mapcontrol, zoomToggle: zoomToggle});
    configureSpinnerEvents(controller);
    configureSearchEvents(controller, search);
    configureInfoboxEvents(controller, locationInfoBox);
    configurePointDataEvents(controller, {pointData: pointData, pointDataTray: pointDataTray});
    configureChoroplethEvents(controller, {mapcontrol: mapcontrol, mapchip: mapchip});
    configureBreadcrumbsEvents(controller, {profileLoader: profileLoader, locationInfoBox: locationInfoBox});
    configureDataExplorerEvents(controller);
    configureProfileEvents(controller, {profileLoader: profileLoader});
    configureMiscElementEvents(controller);
    configureRichDataView(controller);
    configureBoundaryEvents(controller, boundaryTypeBox);

    controller.on('profile.loaded', payload => {
        // there seems to be a bug where menu items close if this is not set
        $(".sub-category__dropdown_wrapper a").attr("href", "#")
    })


    preferredChildToggle.on('preferredChildChange', payload => controller.onPreferredChildChange(payload))

    controller.triggerHashChange()

}

function configureRichDataView(controller) {
    // $('.rich-data-nav__item').click(e => {
    //     controller.triggerEvent('panel.rich_data.nav')
    // })

}
