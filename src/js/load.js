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
const baseUrl = "http://localhost:8001";

var mapcontrol = new MapControl();
var controller = new Controller();

/**
 * Handles creating a choropleth when a subindicator is clicked
 * @param  {[type]} data    An object that contains subindictors and obj
 */
function choropleth(data) {
    var childGeographies = Object.entries(data.obj.children).map(function(childGeography) {
        var code = childGeography[0];
        var count = childGeography[1];
        var universe = data.subindicators.reduce(function(el1, el2) {
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
    controller.on("subindicatorClick", choropleth);

    mapcontrol.on("layerClick", controller.onLayerClick)
    mapcontrol.on("layerMouseOver", controller.onLayerMouseOver)
    mapcontrol.on("layerMouseOut", controller.onLayerMouseOut)

    controller.triggerHashChange()
    // TODO need to set this to the geography searched for
    mapcontrol.overlayBoundaries(null);
}
