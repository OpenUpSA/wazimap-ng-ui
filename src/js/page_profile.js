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
const chartFootnoteClass = '.indicator__chart_footnote';

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


function updateGeography(container, profile) {
    const geography = profile.geography
    const label = `${geography.name} (${geography.code})`;
    $(headerTitleClass, container).text(label);

    addBreadCrumbs(breadcrumbsContainer, profile.parents);
}

function addBreadCrumbs(container, parents) {
    $(breadcrumbClass, container).remove();

    parents.forEach(parent => {
        let breadcrumb = breadcrumbTemplate.cloneNode(true);
        $(".truncate", breadcrumb).text(parent.name) 
        container.append(breadcrumb);
    })
}

function addKeyMetrics(container, profile) {
    $(".key-metric", metricWrapper).remove()

    profile.keyMetrics.forEach(el => {
        let metric = metricTemplate.cloneNode(true)
        $(".key-metric_value div", metric).text(el.value)
        $(".key-metric_title", metric).text(el.label)
        metricWrapper.append(metric)
    })
}


export default class ProfileLoader {

    addCategory(category, categoryDetail) {
        const newCategorySection = categoryTemplate.cloneNode(true);
        const wrapper = newCategorySection;

        $(categoryHeaderTitleClass, newCategorySection).text(category);
        // $(categoryHeaderSubtitleClass, newCategorySection).text(category.subTitle);
         $(categoryHeaderDescriptionClass, newCategorySection).text(categoryDetail.description);

        profileHeader.append(newCategorySection);
        for (const [subcategory, detail] of Object.entries(categoryDetail.subcategories)) {
            this.addSubcategory(wrapper, subcategory, detail);
        }
    }

    addSubcategory(wrapper, subcategory, subcategoryDetail) {
        const newSubcategorySection = subcategoryTemplate.cloneNode(true);
        $(subcategoryTitleClass, newSubcategorySection).text(subcategory);
        $(subcategoryDescriptionClass, newSubcategorySection).text(subcategoryDetail.description);
        wrapper.append(newSubcategorySection);
        //$(subcategoryMetricsClass).dosomethihn

        for (const [indicator, detail] of Object.entries(subcategoryDetail.indicators)) {
            this.addIndicator(newSubcategorySection, indicator, detail);
        }
    }

    addIndicator(wrapper, indicator, indicatorDetail) {
        const newIndicatorSection = indicatorTemplate.cloneNode(true);
        const chartContainer = $(chartContainerClass, newIndicatorSection);

        $(indicatorTitleClass, newIndicatorSection).text(indicator);
        $(chartFootnoteClass, newIndicatorSection).text(indicatorDetail.description);
        wrapper.append(newIndicatorSection);
        
        let subindicators = indicatorDetail.subindicators;
        if (subindicators != undefined && Array.isArray(subindicators)) {
            subindicators.forEach((el) => {
                el["label"] = el.key
                el["value"] = el["count"]
            })
            this.addChart(chartContainer[0], subindicators)
        }
    }

    addChart(container, data) {
        // TODO need to hander different chart types
        const chartType = 'bar';
        const chartClass = `${chartContainerClass}--${chartType}`;
        const fmt = d3format(",.2f");
        const myChart = reusableBarChart();

        // TODO how big should this be?
        myChart.height(100);
        myChart.width(560);
        myChart.tooltipFormatter((d) => {
            return `${d.data.label}: ${fmt(d.data.value)}`;
        });

        $("img", container).remove();
        $("svg", container).remove();


        d3select(container)
            .call(myChart.data(data));
            
        $(".d3-tip")
            .css("z-index", 100)


    }

    loadProfile(dataBundle) {
        const profile = dataBundle.profile;
        const all_categories = profile.profileData;

        $(categoryClass).remove();
        $(subcategoryClass, categoryTemplate).remove();
        $(indicatorClass, subcategoryTemplate).remove();

        updateGeography(profileHeader, profile);
        addKeyMetrics(profileHeader, profile);


        for (const [category, detail] of Object.entries(all_categories)) {
            this.addCategory(category, detail);
        }
    }
}
