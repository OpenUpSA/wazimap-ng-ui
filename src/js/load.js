import {select as d3select} from 'd3-selection';
import {format as d3format} from 'd3-format';
import Controller from './controller';
import loadProfile from './page_profile';
import {loadMenu} from './menu';
import {MapControl} from './maps';
import {getJSON} from './utils';
import {Profile} from './profile';
import {onSubIndicatorChange} from './map_panel';

import "data-visualisations/src/charts/bar/reusable-bar-chart/stories.styles.css";
import "../css/barchart.css";

//const baseUrl = "https://wazimap-ng.openup.org.za";
const baseUrl = "http://localhost:8001";

var mapcontrol = new MapControl();
var controller = new Controller();

function loadGeography(payload) {
    var profileId = payload.profileId;
    var geographyId = payload.geographyId;

    var url = baseUrl + "/api/v1/profiles/" + profileId + "/geographies/" + geographyId + "/"
    getJSON(url).then(function(data) {
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


export default function load(profileId) {
    controller.on("hashChange", loadGeography);
    controller.on("subindicatorClick", function(payload) {
        mapcontrol.choropleth(payload);
    })

    controller.on("subindicatorClick", onSubIndicatorChange);

    mapcontrol.on("layerClick", controller.onLayerClick)
    mapcontrol.on("layerMouseOver", controller.onLayerMouseOver)
    mapcontrol.on("layerMouseOut", controller.onLayerMouseOut)

    controller.triggerHashChange()
    // TODO need to set this to the geography searched for
    mapcontrol.overlayBoundaries(null);
}
