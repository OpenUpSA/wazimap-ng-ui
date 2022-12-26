import {Chart} from '../chart';
import {ContentBlock} from './content_block';
import {SidePanels} from "../../elements/side_panels";

export class Indicator extends ContentBlock {
    constructor(parent, container, indicator, title, isLast, geography, chartAttribution) {
        super(parent, container, indicator, title, isLast, geography);

        this.chartAttribution = chartAttribution;
        this._chart = null;

        this.prepareDomElements();
        this.addIndicatorChart();
    }

    get previouslySelectedFilters() {
        let previouslySelectedFilters = this.parent.filteredIndicators.filter(x => x.indicatorId === this.indicator.id
            && x.filters.filter(y => y.appliesTo.indexOf(SidePanels.PANELS.richData) >= 0).length > 0);

        let tempObj = structuredClone(previouslySelectedFilters);

        tempObj.forEach(x => {
            x.filters = x.filters.filter(x => x.appliesTo.indexOf(SidePanels.PANELS.richData) >= 0);
        });

        return tempObj;
    }

    get hasData() {
        return this.indicator.data.some(function (e) {
            return e.count > 0
        });
    }

    get chart() {
        return this._chart;
    }

    prepareDomElements() {
        super.prepareDomElements();
    }

    addIndicatorChart() {
        let groups = Object.keys(this.indicator.groups);
        const configuration = this.indicator.chartConfiguration;

        let chartData = this.orderChartData();
        let c = new Chart(this, configuration, chartData, groups, this.container, this.title, this.chartAttribution);
        this.bubbleEvents(c, [
            'profile.chart.saveAsPng', 'profile.chart.valueTypeChanged',
            'profile.chart.download_csv', 'profile.chart.download_excel', 'profile.chart.download_json', 'profile.chart.download_kml',
            'point_tray.subindicator_filter.filter', 'profile.chart.filtered'
        ]);

        this._chart = c;
    }

    orderChartData() {
        let primaryGroup = this.indicator.metadata.primary_group;
        let groupsOrder = this.indicator.metadata.groups.find((g) => {
            return g.name === primaryGroup
        });
        let subindicators = groupsOrder.subindicators;
        let data = this.indicator.data;

        // Sort data by subindicators
        data.sort(function (obj1, obj2) {
            return subindicators.indexOf(obj1[primaryGroup]) - subindicators.indexOf(obj2[primaryGroup]);
        })
        this.indicator.data = data;

        return this.indicator;
    }
}
