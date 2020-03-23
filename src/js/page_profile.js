import {select as d3select} from 'd3-selection';
import {format as d3format} from 'd3-format';
import {reusableBarChart} from "data-visualisations/src/charts/bar/reusable-bar-chart/reusable-bar-chart";
import {horizontalBarChart} from "./reusable-charts/horizontal-bar-chart";
import {toLatLng} from "leaflet/src/geo/LatLng";
import {getSelectedBoundary, groupBy, ThemeStyle} from "./utils";

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

const tooltipClsName = 'bar-chart__row_tooltip';
const tooltipClone = $('.sub-indicator__chart_area .' + tooltipClsName)[0].cloneNode(true);

const profileHeader = $(profileHeaderClass);
const categoryTemplate = $(categoryClass)[0].cloneNode(true);
const subcategoryTemplate = $(subcategoryClass, categoryTemplate)[0].cloneNode(true);

const indicatorTemplate = $(indicatorClass, subcategoryTemplate)[0].cloneNode(true);
const breadcrumbsContainer = $(breadcrumbsContainerClass, profileHeader);
const breadcrumbTemplate = $(".breadcrumb", breadcrumbsContainer)[0].cloneNode(true);
const metricWrapper = $(".location-header__key-metrics", profileHeader);
const metricTemplate = $(".key-metric", metricWrapper)[0].cloneNode(true);
const facilityWrapper = $('.location-facilities__wrapper', profileHeader);
const facilityTemplate = $('.location-facility', facilityWrapper)[0].cloneNode(true);
const facilityRowClone = $('.location-facilities__wrapper').find('.location-facility__item')[0].cloneNode(true);

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

function addFacilities(geometries) {
    return
    $('.location-facility', facilityWrapper).remove();

    let categoryArr = [];
    let themeIds = [];
    let themes = [];

    geometries.themes.forEach((theme) => {
        if (themeIds.indexOf(theme.theme_id) < 0) {
            themeIds.push(theme.theme_id);
            themes.push({
                theme_id: theme.theme_id,
                name: theme.theme,
                icon: theme.theme_icon,
                count: theme.locations.count,
                desc:theme.description
            });
        } else {
            themes.filter((t) => {
                return t.theme_id === theme.theme_id
            })[0].count += theme.locations.count
        }

        categoryArr.push(theme);
    });

    themes.forEach((theme) => {
        let facilityItem = facilityTemplate.cloneNode(true);
        $('.location-facility__name .truncate', facilityItem).text(theme.name);
        ThemeStyle.replaceChildDivWithThemeIcon(theme.theme_id, $(facilityItem).find('.location-facility__icon'), $(facilityItem).find('.location-facility__icon'));
        $('.location-facility__value div', facilityItem).text(theme.count);

        //.location-facility__item .tooltip__points_label .truncate
        $('.location-facility__list', facilityItem).html('');
        let themeCategories = categoryArr.filter((c) => {
            return c.theme_id === theme.theme_id
        });

        for (let i = 0; i < themeCategories.length; i++) {
            let rowItem = facilityRowClone.cloneNode(true);
            if (i === themeCategories.length - 1) {
                $(rowItem).addClass('last');
            }

            $('.tooltip__points_label .truncate', rowItem).text(themeCategories[i].label);
            $('.tooltip__value_amount div', rowItem).text(themeCategories[i].locations.count);

            $('.location-facility__list', facilityItem).append(rowItem);
        }
        $('.location-facility__description div', facilityItem).text(theme.desc);

        facilityWrapper.append(facilityItem);
    })
}

export default class ProfileLoader {
    constructor(config) {
        this.config = config;
    }


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
            this.addChart(chartContainer[0], subindicators)
        }
    }

    addChart(container, data) {
        const containerParent = $(container).closest('.indicator__sub-indicator');
        const saveImgButton = $(containerParent).find('.hover-menu__content_wrapper a.hover-menu__content_item:nth-child(1)');

        $('.bar-chart', container).remove();
        $('svg', container).remove();

        const fmt = d3format(",.2f");
        const myChart = horizontalBarChart();
        let tooltip = tooltipClone.cloneNode(true);
        tooltip = $(tooltip).removeAttr('style');

        /**
         * optional settings
         */
        myChart.height(450);
        myChart.width(760);
        myChart.colors(['#39ad84', '#339b77']);
        myChart.xAxisPadding(10);
        myChart.yAxisPadding(10);
        myChart.barHeight(24);
        myChart.barPadding(6);
        myChart.margin({
            top: 15,
            right: 25,
            bottom: 15,
            left: 140,
        })
        myChart.tooltipFormatter((d) => {
            $('.bc__tooltip_value', tooltip).text(fmt(d.data.value));
            $('.bar-chart__tooltip_description .truncate', tooltip).text(' - ' + d.data.label);

            return $(tooltip).prop('outerHTML');
        })

        $(saveImgButton).on('click', () => {
            myChart.saveAsPng(container);
        })

        d3select(container).call(myChart.data(data));
    }

    loadProfile(dataBundle) {
        const profile = dataBundle.profile;
        const all_categories = profile.profileData;
        const geometries = dataBundle.geometries;

        $(categoryClass).remove();
        $(subcategoryClass, categoryTemplate).remove();
        $(indicatorClass, subcategoryTemplate).remove();

        updateGeography(profileHeader, profile);
        addKeyMetrics(profileHeader, profile);
        addFacilities(geometries);

        for (const [category, detail] of Object.entries(all_categories)) {
            this.addCategory(category, detail);
        }
    }
}
