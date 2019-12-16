import {select as d3select} from 'd3-selection';
import {format as d3format} from 'd3-format';
import {reusableBarChart} from "data-visualisations/src/charts/bar/reusable-bar-chart/reusable-bar-chart";
import "data-visualisations/src/charts/bar/reusable-bar-chart/stories.styles.css";

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
                var indicatorLabel = subindicators.indicator;
                var newIndicator = indicatorTemplate.cloneNode(true);
                $(".data-menu__indicator_trigger div", newIndicator).text(indicatorLabel);
                h3Wrapper.append(newIndicator);

                var indicatorWrapper = $(".indicator__dropdown_wrapper", newIndicator);
                var subIndicatorTemplate = $(".data-menu__sub-indicator", newIndicator)[0].cloneNode(true);

                $(".data-menu__sub-indicator", indicatorWrapper).remove();
                $(".menu__link_h4--active", indicatorWrapper).remove();
                if (subindicators.classes != undefined) {

                    for (const [subindicator, value] of Object.entries(subindicators.classes)) {
                        var newSubIndicator = subIndicatorTemplate.cloneNode(true);
                        $("div:nth-child(2)", newSubIndicator).text(subindicator);
                        indicatorWrapper.append(newSubIndicator);

                        $(newSubIndicator).on("click", setActive);
                    };
                } else {
                    indicatorWrapper.remove();
                }
            }
        };
    }
}

function loadProfile(data) {
    var profileWrapper = $(".location-profile");
    var categoryTemplate = $(".location-profile__data-category--first")[0].cloneNode(true);
    var subcategoryTemplate = $(".data-category__indicator", categoryTemplate)[0].cloneNode(true);
    var indicatorTemplate = $(".indicator__chart", subcategoryTemplate)[0].cloneNode(true);

    $(".location-profile__data-category--first").remove();
    $(".location-profile__data-category").remove();
    $(".data-category__indicator", categoryTemplate).remove();
    $(".data-category__indicator--last", categoryTemplate).remove();
    $(".indicator__chart", subcategoryTemplate).remove();


    function addCategory(category, subcategories) {
        var newCategorySection = categoryTemplate.cloneNode(true);
        var wrapper = $(".grid__module_section", newCategorySection);

        $(".data-category__header_title h2", newCategorySection).text(category);
        profileWrapper.append(newCategorySection);
        for (const [subcategory, indicators] of Object.entries(subcategories)) {
            addSubcategory(wrapper, subcategory, indicators);
        }
    }

    function addSubcategory(wrapper, subcategory, indicators) {
        var newSubcategorySection = subcategoryTemplate.cloneNode(true);
        $(".indicator__title_wrapper h3", newSubcategorySection).text(subcategory);
        wrapper.append(newSubcategorySection);

        for (const [indicator, classes] of Object.entries(indicators)) {
            addIndicator(newSubcategorySection, indicator, classes);
        }
    }

    function addIndicator(wrapper, indicator, classes) {
        var newIndicatorSection = indicatorTemplate.cloneNode(true);
        $(".indicator__chart_title", newIndicatorSection).text(classes.indicator);
        wrapper.append(newIndicatorSection);
        var chartContainer = $(".indicator__chart_container", newIndicatorSection);
        addChart(chartContainer[0], classes.classes)
    }

    function addChart(container, classes) {
        var fmt = d3format(",");
        const myChart = reusableBarChart();
        // TODO how big should this be?
        myChart.height(100);
        myChart.width(550);
        myChart.tooltipFormatter((d) => {
            return `${d.data.label}: ${fmt(d.data.value)}`;
        });

        var data = [];
        for (const [key, value] of Object.entries(classes)) {
            if (value != null)
                data.push({label: key, value: value});
        }
        $("img", container).remove();

        d3select(container)
            .call(myChart.data(data));

    }

    for (const [category, subcategories] of Object.entries(data)) {
        addCategory(category, subcategories);
    }
        
}

export default function load() {
    var profileId = 1;
    var geographyId = 3;
    $.ajax({url: baseUrl + "/api/v1/profiles/" + profileId + "/geographies/" + geographyId + "/"})
        .done(function(data) {
            console.log(data);
            loadMenu(data);
            loadProfile(data);
            $(".d3-tip").css("z-index", 100);
            Webflow.require('ix2').init()
        })
}
