import {Chart} from './chart';
import {Component, isNull, isEmptyString} from '../utils';

let indicatorClone = null;

const indicatorClass = '.profile-indicator';
const indicatorTitleClass = '.profile-indicator__title h4';
const chartDescClass = '.profile-indicator__chart_description p';
const sourceClass = '.data-source';

export class ContentBlock extends Component {
    constructor(parent, title, isLast) {
        super(parent)
        self._title = title;
        self._isLast = isLast;
    }

    get title() {
        return self._title;
    }

    get isLast() {
        return self._isLast;
    }
}

export class Indicator extends ContentBlock {
    constructor(parent, container, title, indicatorData, isLast) {
        super(parent, title, isLast);
        this._indicatorData = indicatorData;
        this._container = container;
        this._metadata = indicatorData.metadata;
        this._description = indicatorData.description;

        this.prepareDomElements();
        this.addIndicatorChart();
    }

    get container() {
        return this._container;
    }

    get indicatorData() {
        return this._indicatorData;
    }

    get metadata() {
        return this._metadata;
    }

    get description() {
        return this._description;
    }

    get hasData() {
        return this.indicatorData.data.some(function(e) { return e.count > 0 });
    }

    prepareDomElements() {
        $(indicatorTitleClass, this.container).text(this.title);
        $(chartDescClass, this.container).text(this.description);

        const isLink = !isNull(this.metadata.url);
        if (isLink)
            this.createMetaData();
        else
            $(sourceClass, this.container).text(this.metadata.source);
    }

    createMetaData() {
        let ele = $('<a></a>');
        $(ele).text(this.metadata.source);
        $(ele).attr('href', this.metadata.url);
        $(ele).attr('target', '_blank');
        $(sourceClass, this.container).html(ele);
    }

    addIndicatorChart() {
        let groups = Object.keys(this.indicatorData.groups);
        const configuration = this.indicatorData.chartConfiguration;

        if (this.hasData) {
            let c = new Chart(this, configuration, this.indicatorData, groups, this.container, this.title);
            this.bubbleEvents(c, [
                'profile.chart.saveAsPng', 'profile.chart.valueTypeChanged',
                'profile.chart.download_csv', 'profile.chart.download_excel', 'profile.chart.download_json', 'profile.chart.download_kml',
                'point_tray.subindicator_filter.filter'
            ]);

            if (!this.isLast) {
                $(this.container).removeClass('last');
            }

        }
    }
}
