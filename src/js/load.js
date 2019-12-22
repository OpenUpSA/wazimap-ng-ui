import {select as d3select} from 'd3-selection';
import {format as d3format} from 'd3-format';
import Controller from './controller';
import loadProfile from './page_profile';

import "data-visualisations/src/charts/bar/reusable-bar-chart/stories.styles.css";
import "../css/barchart.css";

//const baseUrl = "https://wazimap-ng.openup.org.za";
const baseUrl = "http://localhost:8000";

function loadMenu(data) {
    var parentContainer = $(".data-menu__links")

    function setActive(el) {
        resetActive();
        $(this).addClass("menu__link_h4--active")
    }

    function resetActive() {
        $(".menu__link_h4--active", parentContainer).removeClass("menu__link_h4--active");
    }

    var categoryTemplate = $(".data-menu__category")[0].cloneNode(true);
    $(".data-menu__category").remove();

    for (const [category, subcategories] of Object.entries(data)) {
        var newCategory = categoryTemplate.cloneNode(true)
        $(".link__h1_title div", newCategory).text(category);
        parentContainer.append(newCategory);
        var h2Wrapper = $(".category__dropdown_wrapper", newCategory);
        var subCategoryTemplate = $(".data-menu__subcategory", h2Wrapper)[0].cloneNode(true);
        $(".data-menu__subcategory", h2Wrapper).remove();

        for (const [subcategory, indicators] of Object.entries(subcategories)) {
            var newSubCategory = subCategoryTemplate.cloneNode(true);
            $(".data-menu__sub-category_trigger div", newSubCategory).text(subcategory);
            h2Wrapper.append(newSubCategory);

            var h3Wrapper = $(".sub-category__dropdown_wrapper", newSubCategory);
            var indicatorTemplate = $(".data-menu__indicator", h3Wrapper)[0].cloneNode(true);

            $(".data-menu__indicator", h3Wrapper).remove();
            for (const [indicator, subindicators] of Object.entries(indicators)) {
                var indicatorLabel = indicator;
                var newIndicator = indicatorTemplate.cloneNode(true);
                $(".data-menu__indicator_trigger div", newIndicator).text(indicatorLabel);
                h3Wrapper.append(newIndicator);

                var indicatorWrapper = $(".indicator__dropdown_wrapper", newIndicator);
                var subIndicatorTemplate = $(".data-menu__sub-indicator", newIndicator)[0].cloneNode(true);

                $(".data-menu__sub-indicator", indicatorWrapper).remove();
                $(".menu__link_h4--active", indicatorWrapper).remove();
                //if (subindicators.classes != undefined) {
                if (true) {

                    subindicators.forEach(function(obj) {
                        var newSubIndicator = subIndicatorTemplate.cloneNode(true);
                        var text = obj.key
                        $("div:nth-child(2)", newSubIndicator).text(text);
                        indicatorWrapper.append(newSubIndicator);

                        $(newSubIndicator).on("click", setActive);
                    })
                } else {
                    indicatorWrapper.remove();
                }
            }
        };
    }
}

function loadGeography(profileId, geographyId) {
    var url = baseUrl + "/api/v1/profiles/" + profileId + "/geographies/" + geographyId + "/"
    $.ajax({url: url})
        .done(function(data) {
            console.log(data);
            loadMenu(data["indicators"]);
            loadProfile(data);
            $(".d3-tip").css("z-index", 100);
            Webflow.require('ix2').init()
        })
}

var controller;

export default function load() {
    var profileId = 1;
    var geographyId = "592012017";
    var controller = new Controller(loadGeography);
    controller.trigger()
}
