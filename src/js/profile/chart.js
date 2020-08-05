import {numFmtAlt, Observable} from "../utils";
import {format as d3format} from "d3-format/src/defaultLocale";
import {horizontalBarChart} from "../reusable-charts/horizontal-bar-chart";
import {select as d3select} from "d3-selection";
import {SubindicatorFilter} from "./subindicator_filter";

const graphValueTypes = ['Percentage', 'Value'];
const chartContainerClass = '.indicator__chart';
const tooltipClass = '.bar-chart__row_tooltip';

let tooltipClone = null;

export class Chart extends Observable {
    constructor(subindicators, groups, detail, graphValueType, _subCategoryNode, title) {
        //we need the detail parameter to be able to filter
        //we need the subindicators and groups too even though we have detail parameter. they are used for the default chart data
        super();

        this.subindicators = subindicators;
        this.graphValueType = graphValueType;
        this.title = title;

        tooltipClone = $(tooltipClass)[0].cloneNode(true);
        this.subCategoryNode = _subCategoryNode;

        const chartContainer = $(chartContainerClass, this.subCategoryNode);
        this.container = chartContainer[0];

        this.handleChartFilter(detail, groups, title);
        this.addChart();
    }

    addChart = () => {
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
        chart.xAxisPadding(10); //padding of the xAxis values(numbers)
        chart.yAxisPadding(10);
        chart.xLabelPadding(30);    //padding of the label
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
            $('.bar-chart__tooltip_name', tooltip).remove();

            return $(tooltip).prop('outerHTML');
        })
        if (this.graphValueType === graphValueTypes[0]) {
            chart.xAxisFormatter((d) => {
                return d + '%';
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
        for (const [label, subindicator] of Object.entries(this.subindicators)) {
            let count = subindicator.count;
            let val = this.graphValueType === graphValueTypes[0] ? this.getPercentageValue(count, this.subindicators) : count;
            arr.push({
                label: subindicator.keys,
                value: val,
                valueText: this.graphValueType === graphValueTypes[0] ? fmt(val) + '%' : fmt(val)
            })
        }

        return arr;
    }

    setChartMenu = (barChart) => {
        const self = this;
        const containerParent = $(this.container).closest('.profile-indicator');

        //save as image button
        const saveImgButton = $(containerParent).find('.hover-menu__content a.hover-menu__content_item:nth-child(1)');

        $(saveImgButton).off('click');
        $(saveImgButton).on('click', () => {
            barChart.saveAsPng(this.container);
            this.triggerEvent('profile.chart.saveAsPng', this);
        })

        //show as percentage / value
        //todo:don't use index, specific class names should be used here when the classes are ready
        $(containerParent).find('.hover-menu__content_list a').each(function (index) {
            $(this).off('click');
            $(this).on('click', () => {
                self.selectedGraphValueTypeChanged(containerParent, index);
            })
        });

        $(containerParent).find('.hover-menu__content_list--last a').each(function (index) {
            $(this).off('click');
            $(this).on('click', () => {
                const downloadFn = {
                    0: {type: 'csv', fn: barChart.exportAsCsv},
                    1: {type: 'excel', fn: barChart.exportAsExcel},
                    2: {type: 'json', fn: barChart.exportAsJson},
                    3: {type: 'kml', fn: barChart.exportAsKml},
                }[index];
                self.triggerEvent(`profile.chart.download_${downloadFn['type']}`, self);

                downloadFn.fn(self.title);
            })
        });
    }

    selectedGraphValueTypeChanged = (containerParent, index) => {
        this.graphValueType = graphValueTypes[index];
        this.triggerEvent('profile.chart.valueTypeChanged', this);

        $(containerParent).find('.hover-menu__content_list a').each(function (itemIndex) {
            $(this).removeClass('active');

            if (index === itemIndex) {
                $(this).addClass('active');
            }
        });

        this.addChart();
    }

    getPercentageValue = (currentValue, subindicators) => {
        let percentage = 0;
        let total = 0;

        for (const [label, value] of Object.entries(subindicators)) {
            total += value.count;
        }

        percentage = currentValue / total * 100;

        return percentage;
    }

    handleChartFilter = (detail, groups, title) => {
        let siFilter = new SubindicatorFilter();
        this.bubbleEvent(siFilter, 'point_tray.subindicator_filter.filter')
        
        let dropdowns = $(this.subCategoryNode).find('.filter__dropdown_wrap');
        const filterArea = $(this.subCategoryNode).find('.profile-indicator__filters');

        siFilter.handleFilter(detail.indicators, filterArea, groups, title, this, dropdowns);
    }

    applyFilter = (chartData) => {
        if (chartData !== null) {
            this.subindicators = chartData;
            this.addChart();
        }
    }
}