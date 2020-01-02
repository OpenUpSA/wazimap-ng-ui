import {select as d3select} from 'd3-selection';
import {format as d3format} from 'd3-format';
import {interpolateBlues as d3interpolateBlues} from 'd3-scale-chromatic';
import {scaleSequential as d3scaleSequential} from 'd3-scale';
import {min as d3min, max as d3max} from 'd3-array';
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

function choropleth(el, data, subindicators, obj) {
    var childGeographies = Object.entries(obj.children).map(function(childGeography) {
        var code = childGeography[0];
        var count = childGeography[1];
        var universe = subindicators.reduce(function(el1, el2) {
          if (el2.children != undefined && el2.children[code] != undefined)
            return el1 + el2.children[code];
          return el1;
        }, 0)
        var val = count / universe;
        return {code: code, val: val};
    })

    var values = childGeographies.map(function(el) {
      return el.val;
    })

    var scale = d3scaleSequential(d3interpolateBlues).domain([d3min(values), d3max(values)])

    childGeographies.forEach(function(el) {
      var layer = mapcontrol.layerCache.geoMap[el.code];
      var color = scale(el.val);
      layer.setStyle({fillColor: color});
    })
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
