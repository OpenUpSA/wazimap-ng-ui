import {select as d3select} from 'd3-selection';
import {format as d3format} from 'd3-format';
import {reusableBarChart} from "data-visualisations/src/charts/bar/reusable-bar-chart/reusable-bar-chart";

function updateGeography(container, data) {
    var geography = data.geography
    var label = geography.name + " (" + geography.code + ")";
    $(".location-header_title h1", container).text(label);

    var breadcrumbsContainer = $(".location-header__breadcumbs_wrapper", container);
    addBreadCrumbs(breadcrumbsContainer, geography);
}

function addBreadCrumbs(container, geography) {
    var breadcrumbTemplate = $(".breadcrumb", container)[0].cloneNode(true);
    $(".breadcrumb", container).remove();

    geography.parents.forEach(function(el) {
        var breadcrumb = breadcrumbTemplate.cloneNode(true);
        $(".truncate", breadcrumb).text(el.name) 
        container.append(breadcrumb);
    })
}

export default function loadProfile(data) {
    var all_indicators = data.indicators;

    var profileWrapper = $(".location-profile");
    var categoryTemplate = $(".location-profile__data-category--first")[0].cloneNode(true);
    var subcategoryTemplate = $(".data-category__indicator", categoryTemplate)[0].cloneNode(true);
    var indicatorTemplate = $(".indicator__chart", subcategoryTemplate)[0].cloneNode(true);

    $(".location-profile__data-category--first").remove();
    $(".location-profile__data-category").remove();
    $(".data-category__indicator", categoryTemplate).remove();
    $(".data-category__indicator--last", categoryTemplate).remove();
    $(".indicator__chart", subcategoryTemplate).remove();

    updateGeography(profileWrapper, data);


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

        classes.forEach(function(el) {
            el["label"] = el.key
            el["value"] = el["count"]
        })
        addChart(chartContainer[0], classes)
    }

    function addChart(container, data) {
        var fmt = d3format(",.2f");
        const myChart = reusableBarChart();
        // TODO how big should this be?
        myChart.height(100);
        myChart.width(850);
        myChart.tooltipFormatter((d) => {
            return `${d.data.label}: ${fmt(d.data.value)}`;
        });

        $("img", container).remove();

        d3select(container)
            .call(myChart.data(data));

    }

    for (const [category, subcategories] of Object.entries(all_indicators)) {
        addCategory(category, subcategories);
    }
        
}
