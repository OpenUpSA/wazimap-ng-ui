import {format as d3format} from 'd3-format/src/defaultLocale';
import {select as d3select} from 'd3-selection';

import {Observable} from '../utils';
import {defaultValues} from '../defaultValues';

import {horizontalBarChart} from '../reusable-charts/horizontal-bar-chart';
import {SubindicatorFilter} from './subindicator_filter';

const PERCENTAGE_TYPE = 'Percentage';
const VALUE_TYPE = 'Value'
const graphValueTypes = [PERCENTAGE_TYPE, VALUE_TYPE];
const chartContainerClass = '.indicator__chart';
const tooltipClass = '.bar-chart__row_tooltip';

let tooltipClone = null;

export class Chart extends Observable {
    constructor(config, subindicators, groups, indicators, graphValueType, _subCategoryNode, title) {
        //we need the subindicators and groups too even though we have detail parameter. they are used for the default chart data
        super();

        this.subindicators = subindicators;
        this.graphValueType = graphValueType;
        this.title = title;
        this.config = config;
        this.selectedFilter = null;
        this.selectedGroup = null;

        tooltipClone = $(tooltipClass)[0].cloneNode(true);
        this.subCategoryNode = _subCategoryNode;

        const chartContainer = $(chartContainerClass, this.subCategoryNode);
        this.container = chartContainer[0];

        this.handleChartFilter(indicators, groups, title);
        this.addChart();
    }

    addChart = () => {
        $('.bar-chart', this.container).remove();
        $('svg', this.container).remove();

        let data = this.getValuesFromSubindicators();
        const barChart = horizontalBarChart();

        this.setChartOptions(barChart);

        this.setChartMenu(barChart);
        d3select(this.container).call(barChart.data(data).reverse(true));
    }

    setChartOptions = (chart) => {
        let tooltip = tooltipClone.cloneNode(true);
        tooltip = $(tooltip).removeAttr('style');

        chart
            .height(450)
            .width(760)
            .colors(['#39ad84', '#339b77'])
            .xAxisPadding(10) //padding of the xAxis values(numbers)
            .yAxisPadding(10)
            .xLabelPadding(30)    //padding of the label
            .barHeight(24)
            .barPadding(6)
            .margin({
                top: 15,
                right: 50,
                bottom: 15,
                left: 120,
            })
            .tooltipFormatter((d) => {
                $('.bar-chart__tooltip_value', tooltip).text(d.data.valueText);
                $('.bar-chart__tooltip_alt-value div', tooltip).text(d.data.label);
                $('.bar-chart__tooltip_name', tooltip).remove();

                return $(tooltip).prop('outerHTML');
            })
            .xLabel("")
            .barTextPadding({
                top: 15,
                left: 5
            })

        this.chartConfig = this.config.types[this.graphValueType]
        this.setChartDomain(chart, this.config, this.graphValueType)

        chart.xAxisFormatter(d => {
            return d3format(this.chartConfig.formatting)(d)
        })
    }

    setChartDomain(chart, config, chartType) {
        const chartConfig = config.types[chartType]
        if (chartConfig.minX != defaultValues.DEFAULT_CONFIG)
            chart.minX(chartConfig.minX)
        if (chartConfig.maxX != defaultValues.DEFAULT_CONFIG)
            chart.maxX(chartConfig.maxX)
    }

    getValuesFromSubindicators = () => {
        let arr = [];
        const chartConfig = this.config.types[this.graphValueType];

        for (const [label, subindicator] of Object.entries(this.subindicators)) {
            let count = subindicator.count;
            let val = this.graphValueType === PERCENTAGE_TYPE ? this.getPercentageValue(count, this.subindicators) : count;
            arr.push({
                label: subindicator.keys,
                value: val,
                valueText: d3format(chartConfig.formatting)(val)
            })
        }

        return arr;
    }

    setChartMenu = (barChart) => {
        const self = this;
        const containerParent = $(this.container).closest('.profile-indicator');

        const saveImgButton = $(containerParent).find('.hover-menu__content a.hover-menu__content_item:nth-child(1)');

        $(saveImgButton).off('click');
        $(saveImgButton).on('click', () => {
            barChart.saveAsPng(this.container);
            this.triggerEvent('profile.chart.saveAsPng', this);
        })

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

                let fileName = self.selectedGroup === null ? `${self.title}` : `${self.title} - by ${self.selectedGroup} - ${self.selectedFilter}`;
                downloadFn.fn(fileName);
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

        percentage = currentValue / total;

        return percentage;
    }

    handleChartFilter = (indicators, groups, title) => {
        let dropdowns = $(this.subCategoryNode).find('.filter__dropdown_wrap');
        const filterArea = $(this.subCategoryNode).find('.profile-indicator__filters');

        let siFilter = new SubindicatorFilter(indicators, filterArea, groups, title, this, dropdowns);
        this.bubbleEvent(siFilter, 'point_tray.subindicator_filter.filter')

    }

    applyFilter = (chartData, selectedGroup, selectedFilter) => {
        this.selectedFilter = selectedFilter;
        this.selectedGroup = selectedGroup;
        if (chartData !== null) {
            this.subindicators = chartData;
            this.addChart();
        }
    }
}
