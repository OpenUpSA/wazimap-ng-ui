import {select as d3select} from 'd3-selection';
import {format as d3format} from 'd3-format';
import {reusableBarChart} from "data-visualisations/src/charts/bar/reusable-bar-chart/reusable-bar-chart";

const profileHeaderClass = '#profile-top';
const categoryClass = '.data-category';
const categoryHeaderClass = '.data-category__header';
const categoryHeaderTitleClass = `${categoryHeaderClass} h2`;
const categoryHeaderSubtitleClass = '.data-category__header_subtitle div';
const categoryHeaderDescriptionClass = '.data-category__header_description p';

const subcategoryClass = '.data-category__indicator';
const subcategoryTitleClass = '.indicator__title_wrapper h3';
const subcategoryDescriptionClass = '.indicator__description p.paragraph';
const subcategoryMetricsClass = '.indicator__key-metrics';

const indicatorClass = '.indicator__sub-indicator';
const indicatorTitleClass = '.sub-indicator__chart_header h4';

const chartContainerClass = '.indicator__chart';

const headerTitleClass = '.location-header__title h1';
const breadcrumbsContainerClass = '.location-header__breadcrumbs';
const breadcrumbClass = '.breadcrumb';

const profileHeader = $(profileHeaderClass);
const categoryTemplate = $(categoryClass)[0].cloneNode(true);
const subcategoryTemplate = $(subcategoryClass, categoryTemplate)[0].cloneNode(true);

const indicatorTemplate = $(indicatorClass, subcategoryTemplate)[0].cloneNode(true);
const breadcrumbsContainer = $(breadcrumbsContainerClass, profileHeader);
const breadcrumbTemplate = $(".breadcrumb", breadcrumbsContainer)[0].cloneNode(true);
const metricWrapper = $(".location-header__key-metrics", profileHeader);
const metricTemplate = $(".key-metric", metricWrapper)[0].cloneNode(true);

function updateGeography(container, data) {
    const geography = data.geography
    const label = geography.name + " (" + geography.code + ")";
    $(headerTitleClass, container).text(label);

    addBreadCrumbs(breadcrumbsContainer, geography);
}

function addBreadCrumbs(container, geography) {
    $(breadcrumbClass, container).remove();

    geography.parents.forEach((el) => {
        let breadcrumb = breadcrumbTemplate.cloneNode(true);
        $(".truncate", breadcrumb).text(el.name) 
        container.append(breadcrumb);
    })
}

function addKeyMetrics(container, data) {
    const metrics = data.key_metrics
    $(".key-metric", metricWrapper).remove()

    metrics.forEach((el) => {
        let metric = metricTemplate.cloneNode(true)
        $(".key-metric_value div", metric).text(el.value)
        $(".key-metric_title", metric).text(el.label)
        metricWrapper.append(metric)
    })
}


export default function loadProfile(data) {

    function addCategory(category, subcategories) {
        const newCategorySection = categoryTemplate.cloneNode(true);
        const wrapper = newCategorySection;

        $(categoryHeaderTitleClass, newCategorySection).text(category);
        // $(categoryHeaderSubtitleClass, newCategorySection).text(category.subTitle);
        // $(categoryHeaderDescriptionClass, newCategorySection).text(category.description);

        profileHeader.append(newCategorySection);
        for (const [subcategory, indicators] of Object.entries(subcategories)) {
            addSubcategory(wrapper, subcategory, indicators);
        }
    }

    function addSubcategory(wrapper, subcategory, indicators) {
        const newSubcategorySection = subcategoryTemplate.cloneNode(true);
        $(subcategoryTitleClass, newSubcategorySection).text(subcategory);
        //$(subcategoryDescriptionClass).text(subcategory.description);
        wrapper.append(newSubcategorySection);
        //$(subcategoryMetricsClass).dosomethihn

        for (const [indicator, classes] of Object.entries(indicators)) {
            addIndicator(newSubcategorySection, indicator, classes);
        }
    }

    function addIndicator(wrapper, indicator, classes) {
        const newIndicatorSection = indicatorTemplate.cloneNode(true);
        const chartContainer = $(chartContainerClass, newIndicatorSection);

        $(indicatorTitleClass, newIndicatorSection).text(indicator);
        wrapper.append(newIndicatorSection);

        classes.forEach((el) => {
            el["label"] = el.key
            el["value"] = el["count"]
        })
        addChart(chartContainer[0], classes)
    }

    function addChart(container, data) {
        // TODO need to hander different chart types
        const chartType = 'bar';
        const chartClass = `${chartContainerClass}--${chartType}`;
        const fmt = d3format(",.2f");
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

    const all_indicators = data.indicators;

    $(categoryClass).remove();
    $(subcategoryClass, categoryTemplate).remove();
    $(indicatorClass, subcategoryTemplate).remove();

    updateGeography(profileHeader, data);
    addKeyMetrics(profileHeader, data);


    for (const [category, subcategories] of Object.entries(all_indicators)) {
        addCategory(category, subcategories);
    }
        
}
