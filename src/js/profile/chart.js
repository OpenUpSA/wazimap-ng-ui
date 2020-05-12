import {numFmtAlt, Observable} from "../utils";
import {format as d3format} from "d3-format/src/defaultLocale";
import {horizontalBarChart} from "../reusable-charts/horizontal-bar-chart";
import {select as d3select} from "d3-selection";

const graphValueTypes = ['Percentage', 'Value'];

export class Chart extends Observable {
    constructor(container, subindicators, attrOptions, graphValueType) {
        super();

        this.container = container;
        this.attrOptions = attrOptions;
        this.subindicators = subindicators;
        this.graphValueType = graphValueType;
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
        const containerParent = $(this.container).closest('.indicator__sub-indicator');

        //save as image button
        const saveImgButton = $(containerParent).find('.hover-menu__content_wrapper a.hover-menu__content_item:nth-child(1)');

        $(saveImgButton).off('click');
        $(saveImgButton).on('click', () => {
            barChart.saveAsPng(container);
        })

        //show as percentage / value
        //todo:don't use index, specific class names should be used here when the classes are ready
        $(containerParent).find('.hover-menu__content_list a').each(function (index) {
            $(this).off('click');
            $(this).on('click', () => {
                self.selectedGraphValueTypeChanged(containerParent);
            })
        });
    }

    selectedGraphValueTypeChanged = (containerParent) => {
        this.graphValueType = graphValueTypes[index];
        $(containerParent).find('.hover-menu__content_list a').each(function (itemIndex) {
            $(this).removeClass('active');

            if (index === itemIndex) {
                $(this).addClass('active');
            }
        });

        this.addChart();
    }
}