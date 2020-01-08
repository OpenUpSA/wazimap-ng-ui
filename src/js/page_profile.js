import {select as d3select} from 'd3-selection';
import {format as d3format} from 'd3-format';
import {reusableBarChart} from "data-visualisations/src/charts/bar/reusable-bar-chart/reusable-bar-chart";

const profileWrapper = $(".location-profile");
const categoryTemplate = $(".location-profile__data-category--first")[0].cloneNode(true);
const subcategoryTemplate = $(".data-category__indicator", categoryTemplate)[0].cloneNode(true);
const indicatorTemplate = $(".indicator__chart", subcategoryTemplate)[0].cloneNode(true);
const breadcrumbsContainer = $(".location-header__breadcumbs_wrapper", profileWrapper);
const breadcrumbTemplate = $(".breadcrumb", breadcrumbsContainer)[0].cloneNode(true);
const metricWrapper = $(".key-metrics", profileWrapper)
const metricTemplate = $(".key-metric", metricWrapper)[0].cloneNode(true)

function updateGeography(container, data) {
    var geography = data.geography
    var label = geography.name + " (" + geography.code + ")";
    $(".location-header_title h1", container).text(label);

    addBreadCrumbs(breadcrumbsContainer, geography);
}

function addBreadCrumbs(container, geography) {
    $(".breadcrumb", container).remove();

    geography.parents.forEach((el) => {
        var breadcrumb = breadcrumbTemplate.cloneNode(true);
        $(".truncate", breadcrumb).text(el.name) 
        container.append(breadcrumb);
    })
}

function addKeyMetrics(container, data) {
    var metrics = data.key_metrics
    $(".key-metric", metricWrapper).remove()

    metrics.forEach((el) => {
        var metric = metricTemplate.cloneNode(true)
        $(".key-metric_value div", metric).text(el.value)
        $(".key-metric_title", metric).text(el.label)
        metricWrapper.append(metric)
    })
}


export default function loadProfile(data) {
    var all_indicators = data.indicators;

    $(".location-profile__data-category--first").remove();
    $(".location-profile__data-category").remove();
    $(".data-category__indicator", categoryTemplate).remove();
    $(".data-category__indicator--last", categoryTemplate).remove();
    $(".indicator__chart", subcategoryTemplate).remove();

    updateGeography(profileWrapper, data);
    addKeyMetrics(profileWrapper, data);


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
        $(".indicator__chart_title h4", newIndicatorSection).text(indicator);
        wrapper.append(newIndicatorSection);
        var chartContainer = $(".indicator__chart_container", newIndicatorSection);

        classes.forEach((el) => {
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
        myChart.width(800);
        myChart.tooltipFormatter((d) => {
            return `${d.data.label}: ${fmt(d.data.value)}`;
        });

        $("img", container).remove();
        $("svg", container).remove();


        d3select(container)
            .call(myChart.data(data));

    }

    for (const [category, subcategories] of Object.entries(all_indicators)) {
        addCategory(category, subcategories);
    }
        
}
