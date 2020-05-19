import {select as d3select} from 'd3-selection';
import {format as d3format} from 'd3-format';
import {reusableBarChart} from "data-visualisations/src/charts/bar/reusable-bar-chart/reusable-bar-chart";
import {horizontalBarChart} from "./reusable-charts/horizontal-bar-chart";
import {toLatLng} from "leaflet/src/geo/LatLng";
import {getSelectedBoundary, groupBy, numFmtAlt, ThemeStyle} from "./utils";
import {MISSING_VALUE} from "./dataobjects";

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

// const keyMetricWrapperClass = '.indicator__key-metrics'
const keyMetricWrapperClass = '.indicator__key-metrics_wrap'
const keyMetricClass = '.key-metric'

const chartContainerClass = '.indicator__chart';
const chartFootnoteClass = '.indicator__chart_footnote';

const sourceClass = '.chart__data-source';

const headerTitleClass = '.location-header__title h1';
const breadcrumbsContainerClass = '.location-header__breadcrumbs';
const breadcrumbClass = '.breadcrumb';

const tooltipClsName = 'bar-chart__row_tooltip';
const tooltipClone = $('.sub-indicator__chart_area .' + tooltipClsName)[0].cloneNode(true);

const profileHeader = $(profileHeaderClass);
let categoryTemplate = null;
let subcategoryTemplate = null;

let indicatorTemplate = null;
const breadcrumbsContainer = $(breadcrumbsContainerClass, profileHeader);
const breadcrumbTemplate = $(".breadcrumb", breadcrumbsContainer)[0].cloneNode(true);
const metricWrapper = $(".indicator__key", profileHeader);
const metricTemplate = $(keyMetricClass)[0].cloneNode(true);
const facilityWrapper = $('.location-header__facilities__wrap', profileHeader);
const facilityTemplate = $('.location-facility', facilityWrapper)[0].cloneNode(true);
const facilityRowClone = facilityWrapper.find('.location-facility__item')[0].cloneNode(true);

const graphValueTypes = ['Percentage', 'Value'];

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

function addFacilities(geometries) {
    $('.location-facility', facilityWrapper).remove();

    let categoryArr = [];
    let themes = [];

    geometries.themes.forEach((theme) => {
        let totalCount = 0;
        theme.subthemes.forEach((st) => {
            totalCount += st.count;

            categoryArr.push({
                theme_id: theme.id,
                count: st.count,
                label: st.label
            });
        });

        themes.push({
            theme_id: theme.id,
            name: theme.name,
            icon: theme.icon,
            count: totalCount
        });
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
            $('.tooltip__value_amount div', rowItem).text(themeCategories[i].count);

            $('.location-facility__list', facilityItem).append(rowItem);
        }
        //$('.location-facility__description div', facilityItem).text(theme.desc);

        facilityWrapper.append(facilityItem);
    })
}

export default class ProfileLoader {
    constructor(config) {
        this.config = config;

        this.graphValueType = graphValueTypes[0];
    }

    addCategory(category, categoryDetail) {
        const metricsArea = subcategoryTemplate.cloneNode(true);
        $(metricsArea).find('.indicator__sub-indicator').remove();
        $(metricsArea).find('.indicator__title').remove();
        $(metricsArea).find('.indicator__description p').text(categoryDetail.description);
        this.addKeyMetrics(metricsArea, categoryDetail);

        const newCategorySection = categoryTemplate.cloneNode(true);
        $(newCategorySection).find('.data-category__header').after(metricsArea);
        const wrapper = newCategorySection;

        $(categoryHeaderTitleClass, newCategorySection).text(category);
        // $(categoryHeaderSubtitleClass, newCategorySection).text(category.subTitle);
        $(categoryHeaderDescriptionClass, newCategorySection).text(categoryDetail.description);

        profileHeader.append(newCategorySection);
        for (const [subcategory, detail] of Object.entries(categoryDetail.subcategories)) {
            this.addSubCategoryChart(wrapper, subcategory, detail);
        }
    }

    addSubCategoryChart(wrapper, subcategory, detail) {
        const subCategoryNode = indicatorTemplate.cloneNode(true);

        let groups = [];
        let subindicators = [];

        $(indicatorTitleClass, subCategoryNode).text(subcategory);
        for (const [indicator, indicators] of Object.entries(detail.indicators)) {
            for (const [item, subindicator] of Object.entries(indicators.subindicators)) {
                subindicators.push(subindicator)
            }
            for (const [group, items] of Object.entries(indicators.groups)) {
                groups.push(group);
            }
        }

        let dropdowns = $(subCategoryNode).find('.filter__dropdown_wrap');
        let indicatorDd = $(dropdowns[0]);
        let subindicatorDd = $(dropdowns[1]);

        let callback = (selected) => this.groupSelected(subCategoryNode, selected, detail, subindicatorDd);
        this.populateDropdown(indicatorDd, groups, callback);

        const chartContainer = $(chartContainerClass, subCategoryNode);

        this.addChart(chartContainer[0], subindicators);
        //this.addKeyMetrics(chartContainer[0], detail.key_metrics);

        wrapper.append(subCategoryNode);
    }

    groupSelected(subCategoryNode, selectedGroup, detail, subindicatorDd) {
        const chartContainer = $(chartContainerClass, subCategoryNode);
        let subindicators = [];
        for (const [obj, subindicator] of Object.entries(detail.indicators)) {
            for (const [key, value] of Object.entries(subindicator.groups[selectedGroup])) {
                subindicators.push(key)
            }
        }

        let callback = (selectedFilter) => this.filterChartValues(chartContainer[0], selectedFilter, selectedGroup, detail);

        this.populateDropdown(subindicatorDd, subindicators, callback);
    }

    filterChartValues(chartContainer, selectedFilter, selectedGroup, detail) {
        let chartData = null;
        for (const [obj, subindicator] of Object.entries(detail.indicators)) {
            for (const [key, value] of Object.entries(subindicator.groups[selectedGroup])) {
                if (key === selectedFilter) {
                    chartData = value;
                }
            }
        }

        let labelColumn = this.getLabelColumnName(chartData);

        if (chartData !== null) {
            this.addChart(chartContainer, chartData, {valueColumn: 'count', labelColumn: labelColumn});
        }
    }

    getLabelColumnName(chartData) {
        //this function returns the key to get the labels from i.e age group, gender..
        let dkey = '';

        if (typeof chartData[0] !== 'undefined' && chartData[0] !== null) {
            Object.keys(chartData[0]).forEach(function eachKey(key) {
                if (key !== 'count') {
                    dkey = key;
                }
            });
        }

        return dkey;
    }

    populateDropdown(dropdown, itemList, callback) {
        if ($(dropdown).hasClass('disabled')) {
            $(dropdown).removeClass('disabled')
        }

        let ddWrapper = $(dropdown).find('.dropdown-menu__content');
        let listItem = $(dropdown).find('.dropdown__list_item')[0].cloneNode(true);

        $(ddWrapper).html('');

        itemList = ['All values'].concat(itemList);

        itemList.forEach((item, i) => {
            let li = listItem.cloneNode(true);
            if (i !== 0 && $(li).hasClass('selected')) {
                //leave the first item selected in default
                $(li).removeClass('selected')
            }
            $('.truncate', li).text(item);
            $(li).on('click', () => {
                this.dropdownOptionSelected(dropdown, li, callback);
            })
            $(ddWrapper).append(li);
        })
    }

    dropdownOptionSelected(dropdown, li, callback) {
        const selectedClsName = 'selected';
        let selected = $(li).text().trim();
        $(dropdown).find('.dropdown__list_item').each(function () {
            if ($(this).hasClass(selectedClsName)) {
                $(this).removeClass(selectedClsName);
            }

            if ($(this).text() === $(li).text()) {
                $(this).addClass(selectedClsName);
            }
        })

        $(dropdown).find('.dropdown-menu__selected-item .truncate-2').text(selected);
        $(dropdown).find('.dropdown-menu__content').hide();

        callback(selected);
    }

    addKeyMetrics(container, categoryDetail) {
        let key_metrics = [];
        for (const [description, subcategories] of Object.entries(categoryDetail.subcategories)) {
            key_metrics = key_metrics.concat(subcategories.key_metrics);
        }

        const wrapper = $(keyMetricWrapperClass, container)
        $(keyMetricClass, wrapper).remove()

        if (key_metrics != undefined && Array.isArray(key_metrics)) {
            key_metrics.forEach(el => {
                if(typeof el !== 'undefined'){
                    let metric = metricTemplate.cloneNode(true)
                    $(".key-metric_value div", metric).text(el.value)
                    $(".key-metric_title", metric).text(el.label)
                    wrapper.append(metric)
                }
            })
            // Show key metrics title
            wrapper.prev().css('display', 'block');
        } else {
            // Hide key metrics title
            wrapper.prev().css('display', 'none');

        }
    }

    getValuesFromSubindicators(subindicators, attrOptions) {
        const fmt = d3format(",.2f");
        let arr = [];
        subindicators.forEach((s) => {
            let value = this.graphValueType === graphValueTypes[0] ? this.getPercentageValue(s[attrOptions.valueColumn], subindicators, attrOptions) : s[attrOptions.valueColumn];

            arr.push({
                label: s[attrOptions.labelColumn],
                value: value,
                valueText: this.graphValueType === graphValueTypes[0] ? fmt(value) + ' %' : fmt(value)
            })
        });

        return arr;
    }

    getPercentageValue(currentValue, subindicators, attrOptions) {
        let percentage = 0;
        let total = 0;

        subindicators.forEach((s) => {
            total += s[attrOptions.valueColumn];
        })

        percentage = currentValue / total * 100;

        return percentage;
    }

    addChart(container, subindicators, attrOptions = {labelColumn: 'label', valueColumn: 'value'}) {
        $('.bar-chart', container).remove();
        $('svg', container).remove();

        let data = this.getValuesFromSubindicators(subindicators, attrOptions);
        const barChart = horizontalBarChart();

        /**
         * optional settings
         */
        this.setChartOptions(barChart);

        this.setChartMenu(container, barChart, subindicators, attrOptions);

        d3select(container).call(barChart.data(data));
    }

    setChartMenu(container, barChart, subindicators, attrOptions) {
        const self = this;
        const containerParent = $(container).closest('.indicator__sub-indicator');

        //save as image button
        const saveImgButton = $(containerParent).find('.hover-menu__content_wrapper a.hover-menu__content_item:nth-child(1)');

        $(saveImgButton).on('click', () => {
            barChart.saveAsPng(container);
        })

        //show as percentage / value
        //todo:don't use index, specific class names should be used here when the classes are ready
        $(containerParent).find('.hover-menu__content_list a').each(function (index) {
            $(this).off('click');
            $(this).on('click', () => {
                self.selectedGraphValueTypeChanged(container, index, containerParent, subindicators, attrOptions);
            })
        });
    }

    selectedGraphValueTypeChanged(container, index, containerParent, subindicators, attrOptions) {
        this.graphValueType = graphValueTypes[index];
        $(containerParent).find('.hover-menu__content_list a').each(function (itemIndex) {
            $(this).removeClass('active');

            if (index === itemIndex) {
                $(this).addClass('active');
            }
        });

        this.addChart(container, subindicators, attrOptions);
    }

    setChartOptions(chart) {
        let tooltip = tooltipClone.cloneNode(true);
        tooltip = $(tooltip).removeAttr('style');

        chart.height(450);
        chart.width(760);
        chart.colors(['#39ad84', '#339b77']);
        chart.xAxisPadding(10);
        chart.yAxisPadding(10);
        chart.barHeight(24);
        chart.barPadding(6);
        chart.margin({
            top: 15,
            right: 0,
            bottom: 15,
            left: 120,
        })
        chart.tooltipFormatter((d) => {
            $('.bc__tooltip_value', tooltip).text(d.data.valueText);
            $('.bar-chart__tooltip_description .truncate', tooltip).text(' - ' + d.data.label);

            return $(tooltip).prop('outerHTML');
        })
        if (this.graphValueType === graphValueTypes[0]) {
            chart.xAxisFormatter((d) => {
                return d + ' %';
            })
        } else {
            chart.xAxisFormatter((d) => {
                return numFmtAlt(d);
            })
        }
    }

    loadProfile(dataBundle) {
        const profile = dataBundle.profile;
        const all_categories = profile.profileData;
        const geometries = dataBundle.geometries;

        categoryTemplate = $(categoryClass)[0].cloneNode(true);
        subcategoryTemplate = $(subcategoryClass, categoryTemplate)[0].cloneNode(true);
        indicatorTemplate = $(indicatorClass, subcategoryTemplate)[0].cloneNode(true);

        $(categoryClass).addClass('hide');
        $(subcategoryClass, categoryTemplate).remove();

        updateGeography(profileHeader, profile);
        addFacilities(geometries);

        for (const [category, detail] of Object.entries(all_categories)) {
            this.addCategory(category, detail);
        }

        $('.location-header__key-metrics').css('display', 'none');
        $('.location-header__key-metrics_title').css('display', 'none');
        $('.location-header__key-metrics_source').css('display', 'none')
        $('.location-facility__description').css('display', 'none')
        $('#profile-print').css('display', 'none')
        $('#profile-share').css('display', 'none')
        $('.map-settings__header').css('display', 'none')
        $('.map-settings__list').css('display', 'none')

    }
}
