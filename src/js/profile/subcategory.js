import {Chart} from "./chart";

let tooltipClone = null;
let isLast = false;

const indicatorTitleClass = '.sub-indicator__title h4';
const chartDescClass = '.sub-indicator__chart_footnote p';
const tooltipClass = '.bar-chart__row_tooltip';

export class Subcategory {
    constructor(wrapper, subcategory, detail, _isLast) {
        this.groups = [];
        this.subindicators = [];

        tooltipClone = $(tooltipClass)[0].cloneNode(true);
        isLast = _isLast;

        this.addSubCategoryChart(wrapper, subcategory, detail);
    }

    addSubCategoryChart(wrapper, subcategory, detail) {
        const subIndicator = $('.sub-indicator')[0].cloneNode(true);
        $(indicatorTitleClass, subIndicator).text(subcategory);
        $(chartDescClass, subIndicator).text(detail.description);

        for (const [indicator, indicators] of Object.entries(detail.indicators)) {
            for (const [item, subindicator] of Object.entries(indicators.subindicators)) {
                this.subindicators.push(subindicator)
            }
            for (const [group, items] of Object.entries(indicators.groups)) {
                this.groups.push(group);
            }
        }
        let c = new Chart( this.subindicators, this.groups, {
            labelColumn: 'label',
            valueColumn: 'value'
        }, detail, 'Percentage', subIndicator);

        $(subIndicator).removeClass('last');

        if (isLast) {
            $(subIndicator).addClass('last');
        }

        wrapper.append(subIndicator);
    }
}