import {Chart} from "./chart";
import {Observable} from "../utils";

let indicatorClone = null;
let isLast = false;

const indicatorClass = '.profile-indicator';
const indicatorTitleClass = '.profile-indicator__title h4';
const chartDescClass = '.profile-indicator__chart_description p';
const sourceClass = '.data-source';

export class Indicator extends Observable {
    constructor(wrapper, title, indicatorData, detail, _isLast) {
        super();
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
        this.bubbleEvents(c, [
            'profile.chart.saveAsPng', 'profile.chart.valueTypeChanged',
            'profile.chart.download_csv', 'profile.chart.download_excel', 'profile.chart.download_json', 'profile.chart.download_kml'
        ]);

        if (!isLast) {
            $(indicator).removeClass('last');
        }

        wrapper.append(indicator);
    }
}