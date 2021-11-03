import {Chart} from '../chart';
import {ContentBlock} from './content_block';

export class Indicator extends ContentBlock {
    constructor(parent, container, indicator, title, isLast, geography) {
        super(parent, container, indicator, title, isLast, geography);

        this.prepareDomElements();
        this.addIndicatorChart();
    }

    get hasData() {
        return this.indicator.data.some(function(e) { return e.count > 0 });
    }

    prepareDomElements() {
        super.prepareDomElements();
    }

    addIndicatorChart() {
        let groups = Object.keys(this.indicator.groups);
        const configuration = this.indicator.chartConfiguration;

        if (this.hasData) {
            let c = new Chart(this, configuration, this.indicator, groups, this.container, this.title);
            this.bubbleEvents(c, [
                'profile.chart.saveAsPng', 'profile.chart.valueTypeChanged',
                'profile.chart.download_csv', 'profile.chart.download_excel', 'profile.chart.download_json', 'profile.chart.download_kml',
                'point_tray.subindicator_filter.filter'
            ]);

        }
    }
}
