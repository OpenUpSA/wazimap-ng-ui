import {Chart} from "./chart";

let indicatorTemplate = null;
let tooltipClone = null;

const indicatorTitleClass = '.sub-indicator__chart_header h4';
const chartContainerClass = '.indicator__chart';

export class Subcategory {
    constructor(wrapper, subcategory, detail, _indicatorTemplate, _tooltipClone) {
        this.groups = [];
        this.subindicators = [];

        indicatorTemplate = _indicatorTemplate;
        tooltipClone = _tooltipClone;

        this.addSubCategoryChart(wrapper, subcategory, detail);
    }

    addSubCategoryChart(wrapper, subcategory, detail) {
        const subCategoryNode = indicatorTemplate.cloneNode(true);
        $(indicatorTitleClass, subCategoryNode).text(subcategory);


        for (const [indicator, indicators] of Object.entries(detail.indicators)) {
            for (const [item, subindicator] of Object.entries(indicators.subindicators)) {
                this.subindicators.push(subindicator)
            }
            for (const [group, items] of Object.entries(indicators.groups)) {
                this.groups.push(group);
            }
        }
        const chartContainer = $(chartContainerClass, subCategoryNode);
        let c = new Chart(chartContainer[0], this.subindicators, this.groups, {
            labelColumn: 'label',
            valueColumn: 'value'
        }, detail, 'Percentage', tooltipClone, subCategoryNode);


        wrapper.append(subCategoryNode);
    }
}