import {Chart} from '../chart';
import {ContentBlock} from './content_block';

export class Indicator extends ContentBlock {
    constructor(parent, container, indicator, title, isLast) {
        super(parent, container, indicator, title, isLast);

        this.prepareDomElements();
        this.addIndicatorChart();
    }

    get hasData() {
        return this.indicator.data.some(function (e) {
            return e.count > 0
        });
    }

    prepareDomElements() {
        super.prepareDomElements();
    }

    addIndicatorChart() {
        let groups = Object.keys(this.indicator.groups);
        const configuration = this.indicator.chartConfiguration;

        if (this.hasData) {
            let chartData = this.orderChartData();
            let c = new Chart(this, configuration, chartData, groups, this.container, this.title);
            this.bubbleEvents(c, [
                'profile.chart.saveAsPng', 'profile.chart.valueTypeChanged',
                'profile.chart.download_csv', 'profile.chart.download_excel', 'profile.chart.download_json', 'profile.chart.download_kml',
                'point_tray.subindicator_filter.filter'
            ]);

        }
    }

    orderChartData() {
        let primaryGroup = this.indicator.metadata.primary_group;
        let groupsOrder = this.indicator.metadata.groups.filter((g) => {
            return g.name === primaryGroup
        })[0];
        let orderedGroups = [];

        groupsOrder.subindicators.forEach((g) => {
            let d = this.indicator.data.filter((x) => {
                return x[primaryGroup] === g
            })[0];
            orderedGroups.push(d);
        })

        this.indicator.data = orderedGroups;

        return this.indicator;
    }
}
