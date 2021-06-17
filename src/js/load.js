import {select as d3select} from 'd3-selection';
import Controller from './controller';
import ProfileLoader from "./profile/profile_loader";
import {MapControl} from './map/maps';
import {Component} from './utils';
import {Profile} from './profile';
import {onProfileLoaded as onProfileLoadedSearch, Search} from './elements/search';
import {MapChip} from './elements/mapchip/mapchip';
import {LocationInfoBox} from './elements/location_info_box';
import {PointData} from "./map/point_data";
import {ZoomToggle} from "./mapmenu/zoomtoggle";
import {PreferredChildToggle} from "./mapmenu/preferred_child_toggle";
import {PointDataTray} from './elements/point_tray/tray';
import Analytics from './analytics';
import {BoundaryTypeBox} from "./map/boundary_type_box";
import {MapDownload} from "./map/map_download";
import {Tutorial} from "./elements/tutorial";
import {DataMapperMenu} from './elements/menu';

import "data-visualisations/src/charts/bar/reusable-bar-chart/stories.styles.css";
import "../css/barchart.css";
import {Popup} from "./map/popup";
import {TabNotice} from "./elements/tab_notice";

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
import {configureMapDownloadEvents} from "./setup/mapdownload";
import {configureTutorialEvents} from "./setup/tutorial";
import {configureTabNoticeEvents} from "./setup/tabnotice";
import {configureTranslationEvents} from "./setup/translations"
import {configurePage} from "./setup/general";
import {Translations} from "./elements/translations";
import {StyleConfig} from "./elements/style_config";
import {configureStyleConfigEvents} from "./setup/styleconfig";

let defaultFormattingConfig = {
    decimal: ",.1f",
    integer: ",.2d",
    percentage: ".1%"
}

export default function configureApplication(profileId, config) {
    let application = new Application(profileId, config);
}

class Application extends Component {
    constructor(profileId, config) {
        super()

        const api = config.api;
        const controller = new Controller(this, api, config, profileId);
        if (config.analytics)
            config.analytics.registerEvents(controller);

        let serverFormattingConfig = config.config.formatting;
        let formattingConfig = {...defaultFormattingConfig, ...serverFormattingConfig};

        const mapcontrol = new MapControl(this, config, () => controller.shouldMapZoom);
        mapcontrol.popup = new Popup(this, formattingConfig, mapcontrol.map);
        const pointData = new PointData(this, api, mapcontrol.map, profileId, config);
        const pointDataTray = new PointDataTray(this, api, profileId);
        const mapchip = new MapChip(this, config.choropleth);
        const search = new Search(this, api, profileId, 2);
        const profileLoader = new ProfileLoader(this, formattingConfig, api, profileId, config.config);
        const locationInfoBox = new LocationInfoBox(this, formattingConfig);
        const zoomToggle = new ZoomToggle(this);
        const preferredChildToggle = new PreferredChildToggle(this);
        const boundaryTypeBox = new BoundaryTypeBox(this, config.config.preferred_children);
        const mapDownload = new MapDownload(this, mapchip);
        const tutorial = new Tutorial(this);
		const styleConfig = new StyleConfig(config.style);
        const tabNotice = new TabNotice(this, config.config.feedback);
        const translations = new Translations(config.config.translations);
        const dataMapperMenu = new DataMapperMenu(this);

        configureMapEvents(controller, {mapcontrol: mapcontrol, zoomToggle: zoomToggle});
        configureSpinnerEvents(controller);
        configureSearchEvents(controller, search);
        configureInfoboxEvents(controller, locationInfoBox);
        configurePointDataEvents(controller, {pointData: pointData, pointDataTray: pointDataTray});
        configureChoroplethEvents(controller, {mapcontrol: mapcontrol, mapchip: mapchip});
        configureBreadcrumbsEvents(controller, {profileLoader: profileLoader, locationInfoBox: locationInfoBox});
        configureDataExplorerEvents(controller, dataMapperMenu);
        configureProfileEvents(controller, {profileLoader: profileLoader});
        configureMiscElementEvents(this, controller);
        configureBoundaryEvents(controller, boundaryTypeBox);
        configureMapDownloadEvents(mapDownload);
        configureTutorialEvents(controller, tutorial, config.config.tutorial);
        configureTabNoticeEvents(controller, tabNotice);
        configureTranslationEvents(controller, translations);
        configurePage(controller, config);
		configureStyleConfigEvents(controller, styleConfig);

        controller.on('profile.loaded', payload => {
            // there seems to be a bug where menu items close if this is not set
            $(".sub-category__dropdown_wrapper a").attr("href", "#")
        })


        preferredChildToggle.on('preferredChildChange', payload => controller.onPreferredChildChange(payload))

        controller.triggerHashChange()

    }
}
