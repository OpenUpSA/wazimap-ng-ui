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
const typeIndex = {
    'Percentage': 0,
    'Value': 1
}


export class Chart extends Observable {
    constructor(config, subindicators, groups, indicators, _subCategoryNode, title) {
        //we need the subindicators and groups too even though we have detail parameter. they are used for the default chart data
        super();

        this.subindicators = subindicators;
        this.graphValueType = config.defaultType
        this.title = title;
        this.config = config;
        this.selectedFilter = null;
        this.selectedGroup = null;

        tooltipClone = $(tooltipClass)[0].cloneNode(true);
        this.subCategoryNode = _subCategoryNode;

        const chartContainer = $(chartContainerClass, this.subCategoryNode);
        this.container = chartContainer[0];
        this.containerParent = $(this.container).closest('.profile-indicator');


        this.handleChartFilter(indicators, groups, title);
        this.selectedGraphValueTypeChanged(this.containerParent, typeIndex[this.graphValueType]);
    }

    addChart = () => {
        $('.bar-chart', this.container).remove();
        $('svg', this.container).remove();

        let data = this.getValuesFromSubindicators();
        const barChart = horizontalBarChart();

        this.setChartOptions(barChart);

        this.setChartMenu(barChart);
        d3select(this.container).call(barChart.data(data).reverse(true));
        this.showChartDataTable();
    }

    showChartDataTable = () => {
        let data = this.getValuesFromSubindicators();

        this.containerParent.find('.chart-table').remove();

        let table = document.createElement('table');
        $(table).addClass('chart-table');
        let thead = document.createElement('thead');
        let headRow = document.createElement('tr');
        let headCol1 = document.createElement('th');
        $(headCol1).text(this.title);
        $(headRow).append(headCol1);
        let headCol2 = document.createElement('th');
        $(headCol2).text('Absolute');
        $(headRow).append(headCol2);
        let headCol3 = document.createElement('th');
        $(headCol3).text('Percentage');
        $(headRow).append(headCol3);

        $(thead).append(headRow);
        $(table).append(thead);

        for (const [label, subindicator] of Object.entries(this.subindicators)) {
            let absolute_val = subindicator.count;
            let percentage_val = this.getPercentageValue(absolute_val, this.subindicators);
            let row = document.createElement('tr');
            let col1 = document.createElement('td');
            $(col1).text(subindicator.keys);
            let col2 = document.createElement('td');
            $(col2).text(d3format(this.config.types[VALUE_TYPE].formatting)(absolute_val));
            let col3 = document.createElement('td');
            $(col3).text(d3format(this.config.types[PERCENTAGE_TYPE].formatting)(percentage_val));
            $(row).append(col1);
            $(row).append(col2);
            $(row).append(col3);
            $(table).append(row);
        }

        this.containerParent.append(table);
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
            .xTicks(this.config.xTicks)
            .barHeight(24)
            .barPadding(6)
            .margin({
                top: 15,
                right: 65,
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

    disableChartTypeToggle = (disable) => {
        if (disable) {
            $(this.containerParent).find('.hover-menu__content_item--no-link:first').hide()
            $(this.containerParent).find('.hover-menu__content_list').hide()
        }
    }

    setChartMenu = (barChart) => {
        const self = this;
        const saveImgButton = $(this.containerParent).find('.hover-menu__content a.hover-menu__content_item:nth-child(1)');

        $(saveImgButton).off('click');
        $(saveImgButton).on('click', () => {
            let chartTitle = self.getChartTitle(':');
            let fileName = 'chart.png';
            barChart.saveAsPng(this.container, fileName, chartTitle);
            this.triggerEvent('profile.chart.saveAsPng', this);
        })

        //todo:don't use index, specific class names should be used here when the classes are ready
        $(this.containerParent).find('.hover-menu__content_list a').each(function (index) {
            $(this).off('click');
            $(this).on('click', () => {
                self.selectedGraphValueTypeChanged(self.containerParent, index);
            })
        });

        this.disableChartTypeToggle(this.config.disableToggle);


        $(this.containerParent).find('.hover-menu__content_list--last a').each(function (index) {
            $(this).off('click');
            $(this).on('click', () => {
                const downloadFn = {
                    0: {type: 'csv', fn: barChart.exportAsCsv},
                    1: {type: 'excel', fn: barChart.exportAsExcel},
                    2: {type: 'json', fn: barChart.exportAsJson},
                    3: {type: 'kml', fn: barChart.exportAsKml},
                }[index];
                self.triggerEvent(`profile.chart.download_${downloadFn['type']}`, self);

                let fileName = self.getChartTitle('-');
                downloadFn.fn(fileName);
            })
        });
    }

    getChartTitle = (separator) => {
        return this.selectedGroup === null ? `${this.title}` : `${this.title} by ${this.selectedGroup} ${separator} ${this.selectedFilter}`;
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
