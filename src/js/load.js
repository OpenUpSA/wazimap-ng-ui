import {select as d3select} from 'd3-selection';
import {format as d3format} from 'd3-format';
import Controller from './controller';
import loadProfile from './page_profile';
import {loadMenu} from './menu';
import {MapControl} from './maps';
import {getJSON} from './utils';

import "data-visualisations/src/charts/bar/reusable-bar-chart/stories.styles.css";
import "../css/barchart.css";

//const baseUrl = "https://wazimap-ng.openup.org.za";
const baseUrl = "http://localhost:8000";

function loadGeography(profileId, geographyId) {
    var url = baseUrl + "/api/v1/profiles/" + profileId + "/geographies/" + geographyId + "/"
    getJSON(url).then(function(data) {
        console.log(data);
        loadMenu(data["indicators"]);
        loadProfile(data);
        // TODO need to move this somewhere useful
        $(".d3-tip").css("z-index", 100);
        Webflow.require('ix2').init()
    })
}

var controller;

export default function load(profileId) {
    var controller = new Controller(loadGeography);
    var mapcontrol = new MapControl();

    mapcontrol.on("geoselect", function(areaCode) {
        controller.setGeography(areaCode);
    })

    controller.trigger()
    // TODO need to set this to the geography searched for
    mapcontrol.overlayBoundaries(null);
}
