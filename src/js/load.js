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

var mapcontrol = new MapControl();

function getColor(d) {
    return d > 0.3 ? '#800026' :
           d > 0.25 ? '#BD0026' :
           d > 0.2 ? '#E31A1C' :
           d > 0.15 ? '#FC4E2A' :
           d > 0.1 ? '#FD8D3C' :
           d > 0.05 ? '#FEB24C' :
           d > 0   ? '#FED976' :
                      '#FFEDA0';
}

function choropleth(el, obj) {
    console.log(obj) 
    var total = 0
    for (const [code, count] of Object.entries(obj.children)) {
        total += count;
    }

    for (const [code, count] of Object.entries(obj.children)) {
        var val = count / total;
        var layer = mapcontrol.layerCache.geoMap[code];    
        layer.setStyle({fillColor: getColor(val)})
    }

}

function loadGeography(profileId, geographyId) {
    var url = baseUrl + "/api/v1/profiles/" + profileId + "/geographies/" + geographyId + "/"
    getJSON(url).then(function(data) {
        console.log(data);
        loadMenu(data["indicators"], choropleth);
        loadProfile(data);
        // TODO need to move this somewhere useful
        $(".d3-tip").css("z-index", 100);
        Webflow.require('ix2').init()
    })
}

var controller;

export default function load(profileId) {
    var controller = new Controller(loadGeography);

    mapcontrol.on("geoselect", function(areaCode) {
        controller.setGeography(areaCode);
    })

    controller.trigger()
    // TODO need to set this to the geography searched for
    mapcontrol.overlayBoundaries(null);
}
