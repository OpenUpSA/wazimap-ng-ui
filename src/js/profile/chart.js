import {numFmtAlt, Observable} from "../utils";
import {format as d3format} from "d3-format/src/defaultLocale";
import {horizontalBarChart} from "../reusable-charts/horizontal-bar-chart";
import {select as d3select} from "d3-selection";

const graphValueTypes = ['Percentage', 'Value'];
const allValues = 'All values';
const chartContainerClass = '.indicator__chart';
const tooltipClass = '.bar-chart__row_tooltip';

let tooltipClone = null;
let subCategoryNode = null;

export class Chart extends Observable {
    constructor(subindicators, groups, attrOptions, detail, graphValueType, _subCategoryNode) {
        super();

        this.attrOptions = attrOptions;
        this.subindicators = subindicators;
        this.graphValueType = graphValueType;

        tooltipClone = $(tooltipClass)[0].cloneNode(true);
        subCategoryNode = _subCategoryNode;

        const chartContainer = $(chartContainerClass, subCategoryNode);
        this.container = chartContainer[0];

        this.handleChartFilter(detail, groups);
        this.addChart();
    }

    addChart = (ret = false) => {
        $('.bar-chart', this.container).remove();
        $('svg', this.container).remove();

        let data = this.getValuesFromSubindicators();
        const barChart = horizontalBarChart();

        this.setChartOptions(barChart);
        this.setChartMenu(barChart);
        d3select(this.container).call(barChart.data(data));
    }

    setChartOptions = (chart) => {
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
            $('.bar-chart__tooltip_value', tooltip).text(d.data.valueText);
            $('.bar-chart__tooltip_alt-value div', tooltip).text(d.data.label);

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

    getValuesFromSubindicators = () => {
        const fmt = d3format(",.2f");
        let arr = [];
        this.subindicators.forEach((s) => {
            let value = this.graphValueType === graphValueTypes[0] ? this.getPercentageValue(s[this.attrOptions.valueColumn], this.subindicators, this.attrOptions) : s[this.attrOptions.valueColumn];

            arr.push({
                label: s[this.attrOptions.labelColumn],
                value: value,
                valueText: this.graphValueType === graphValueTypes[0] ? fmt(value) + ' %' : fmt(value)
            })
        });

        return arr;
    }

    setChartMenu = (barChart) => {
        const self = this;
        const containerParent = $(this.container).closest('.sub-indicator');

        //save as image button
        const saveImgButton = $(containerParent).find('.hover-menu__content a.hover-menu__content_item:nth-child(1)');

        $(saveImgButton).off('click');
        $(saveImgButton).on('click', () => {
            barChart.saveAsPng(this.container);
        })

        //show as percentage / value
        //todo:don't use index, specific class names should be used here when the classes are ready
        $(containerParent).find('.hover-menu__content_list a').each(function (index) {
            $(this).off('click');
            $(this).on('click', () => {
                self.selectedGraphValueTypeChanged(containerParent, index);
            })
        });
    }

    selectedGraphValueTypeChanged = (containerParent, index) => {
        this.graphValueType = graphValueTypes[index];
        $(containerParent).find('.hover-menu__content_list a').each(function (itemIndex) {
            $(this).removeClass('active');

            if (index === itemIndex) {
                $(this).addClass('active');
            }
        });

        this.addChart();
    }

    getPercentageValue = (currentValue, subindicators, attrOptions) => {
        let percentage = 0;
        let total = 0;

        subindicators.forEach((s) => {
            total += s[attrOptions.valueColumn];
        })

        percentage = currentValue / total * 100;

        return percentage;
    }

    handleChartFilter = (detail, groups) => {
        let dropdowns = $(subCategoryNode).find('.filter__dropdown_wrap');
        let indicatorDd = $(dropdowns[0]);
        let subindicatorDd = $(dropdowns[1]);

        let callback = (selected) => this.groupSelected(subCategoryNode, selected, detail, subindicatorDd);
        this.populateDropdown(indicatorDd, groups, callback);
    }

    populateDropdown = (dropdown, itemList, callback) => {
        if ($(dropdown).hasClass('disabled')) {
            $(dropdown).removeClass('disabled')
        }

        let ddWrapper = $(dropdown).find('.dropdown-menu__content');
        let listItem = $(dropdown).find('.dropdown__list_item')[0].cloneNode(true);

        $(ddWrapper).html('');

        itemList = [allValues].concat(itemList);

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

    dropdownOptionSelected = (dropdown, li, callback) => {
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

        $(dropdown).find('.dropdown-menu__selected-item .truncate').text(selected);
        $(dropdown).find('.dropdown-menu__content').hide();

        callback(selected);
    }

    groupSelected = (subCategoryNode, selectedGroup, detail, subindicatorDd) => {
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

    filterChartValues = (chartContainer, selectedFilter, selectedGroup, detail) => {
        let chartData = null;
        if (selectedFilter !== allValues) {
            for (const [obj, subindicator] of Object.entries(detail.indicators)) {
                for (const [key, value] of Object.entries(subindicator.groups[selectedGroup])) {
                    if (key === selectedFilter) {
                        chartData = value;
                    }
                }
            }

            let labelColumn = this.getLabelColumnName(chartData);
            this.attrOptions = {valueColumn: 'count', labelColumn: labelColumn};
        } else {
            for (const [obj, subindicator] of Object.entries(detail.indicators)) {
                chartData = subindicator.subindicators;
            }

            this.attrOptions = {labelColumn: 'label', valueColumn: 'value'};
        }

        if (chartData !== null) {
            this.subindicators = chartData;
            this.addChart();
        }
    }

    getLabelColumnName = (chartData) => {
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
}