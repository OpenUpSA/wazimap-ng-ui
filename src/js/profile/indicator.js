import {Chart} from './chart';
import {Text} from './text';
import {Component, isNull, isEmptyString} from '../utils';

let indicatorClone = null;
let isLast = false;

const indicatorClass = '.profile-indicator';
const indicatorTitleClass = '.profile-indicator__title h4';
const chartDescClass = '.profile-indicator__chart_description p';
const sourceClass = '.data-source';

export class Indicator extends Component {
    constructor(parent, formattingConfig, wrapper, title, indicatorData, detail, _isLast) {
        super(parent);
        this.groups = [];
        this.indicatorData = indicatorData;
        this.formattingConfig = formattingConfig;

        indicatorClone = $(indicatorClass)[0].cloneNode(true);

        isLast = _isLast;

        if (indicatorData.chartConfiguration.rawText) {
            this.addIndicatorText(wrapper, title, indicatorData);
        }
        else {
            this.addIndicatorChart(wrapper, title, indicatorData, detail);
        }
    }

    addIndicatorChart(wrapper, title, indicatorData, detail) {
        let indicatorNode = indicatorClone.cloneNode(true);
        $(indicatorTitleClass, indicatorNode).text(title);
        $(chartDescClass, indicatorNode).text(indicatorData.description);
        const isLink = !isNull(indicatorData.metadata.url) && !isEmptyString(indicatorData.metadata.url);

        if (isLink) {
            let ele = $('<a></a>');
            $(ele).text(indicatorData.metadata.source);
            $(ele).attr('href', indicatorData.metadata.url);
            $(ele).attr('target', '_blank');
            $(sourceClass, indicatorNode).html(ele);
        } else {
            $(sourceClass, indicatorNode).text(indicatorData.metadata.source);
        }

        if (indicatorData.groups !== null && typeof indicatorData.groups !== 'undefined') {
            for (const [group, items] of Object.entries(indicatorData.groups)) {
                this.groups.push(group);
            }
        }


        const configuration = detail.indicators[title].chartConfiguration;
        const indicators = detail.indicators;

        let hasValues = this.indicatorData.data.some(function(e) { return e.count > 0 });

        if (hasValues) {
            let c = new Chart(this, configuration, indicatorData, this.groups, indicatorNode, title);
            this.bubbleEvents(c, [
                'profile.chart.saveAsPng', 'profile.chart.valueTypeChanged',
                'profile.chart.download_csv', 'profile.chart.download_excel', 'profile.chart.download_json', 'profile.chart.download_kml',
                'point_tray.subindicator_filter.filter'
            ]);

            if (!isLast) {
                $(indicatorNode).removeClass('last');
            }

            wrapper.append(indicatorNode);

        }
    }

    addIndicatorText(wrapper, title, indicatorData) {
        let indicatorNode = indicatorClone.cloneNode(true);
        $(indicatorTitleClass, indicatorNode).text(title);
        $(chartDescClass, indicatorNode).text(indicatorData.description);
        const isLink = !isNull(indicatorData.metadata.url) && !isEmptyString(indicatorData.metadata.url);

        if (isLink) {
            let ele = $('<a></a>');
            $(ele).text(indicatorData.metadata.source);
            $(ele).attr('href', indicatorData.metadata.url);
            $(ele).attr('target', '_blank');
            $(sourceClass, indicatorNode).html(ele);
        } else {
            $(sourceClass, indicatorNode).text(indicatorData.metadata.source);
        }

        let c = new Text(this, indicatorNode, indicatorData);

        if (!isLast) {
            $(indicatorNode).removeClass('last');
        }

        wrapper.append(indicatorNode);
    }
}
