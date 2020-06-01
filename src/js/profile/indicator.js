import {Chart} from "./chart";

let indicatorClone = null;
let isLast = false;

const indicatorClass = '.profile-indicator';
const indicatorTitleClass = '.profile-indicator__title h4';
const chartDescClass = '.profile-indicator__chart_description p';
const sourceClass = '.data-source';

export class Indicator {
    constructor(wrapper, title, indicatorData, detail, _isLast) {
        this.groups = [];
        this.subindicators = indicatorData.subindicators;

        indicatorClone = $(indicatorClass)[0].cloneNode(true);

        isLast = _isLast;

        this.addIndicatorChart(wrapper, title, indicatorData, detail);
    }

    addIndicatorChart(wrapper, title, indicatorData, detail) {
        let indicator = indicatorClone.cloneNode(true);
        $(indicatorTitleClass, indicator).text(title);
        $(chartDescClass, indicator).text(indicatorData.description);

        if (typeof indicatorData.metadata !== 'undefined') {
            $(sourceClass, indicator).text(indicatorData.metadata.source);
        }

        if (indicatorData.groups !== null && typeof indicatorData.groups !== 'undefined') {
            for (const [group, items] of Object.entries(indicatorData.groups)) {
                this.groups.push(group);
            }
        }

        let c = new Chart(this.subindicators, this.groups, detail, 'Percentage', indicator, title);

        if (!isLast) {
            $(indicator).removeClass('last');
        }

        wrapper.append(indicator);
    }
}