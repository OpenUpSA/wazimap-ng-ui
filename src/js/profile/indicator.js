import {Chart} from './chart';
import {Text} from './text';
import {Component, isNull, isEmptyString} from '../utils';

let indicatorClone = null;
let isLast = false;

const indicatorClass = '.profile-indicator';
const indicatorTitleClass = '.profile-indicator__title h4';
const chartDescClass = '.profile-indicator__chart_description p';
const sourceClass = '.data-source';

export class InfoBlock extends Component {
    constructor(parent, formattingConfig, wrapper, title, indicatorData, detail, _isLast) {
        super(parent);
        this.groups = [];
        this.indicatorData = indicatorData;
        this.formattingConfig = formattingConfig;

        indicatorClone = $(indicatorClass)[0].cloneNode(true);

        isLast = _isLast;

        this.prepareDomElements(this.indicatorNode, this.title, this.indicatorData);
    }

    prepareDomElements(indicatorNode, title, indicatorData) {
        this.indicatorNode = indicatorClone.cloneNode(true);
        $(indicatorTitleClass, indicatorNode).text(title);
        $(chartDescClass, indicatorNode).text(indicatorData.description);
        this.extractMetadata(indicatorData.metadata, indicatorNode);
    }

    extractMetadata(metadata, indicatorNode) {
        if (metadata.url) {
            let ele = $('<a></a>');
            $(ele).text(metadata.source);
            $(ele).attr('href', metadata.url);
            $(ele).attr('target', '_blank');
            $(sourceClass, indicatorNode).html(ele);
        } else {
            $(sourceClass, indicatorNode).text(metadata.source);
        }
    }
}

export class IndicatorBlock extends InfoBlock {
    constructor(parent, formattingConfig, wrapper, title, indicatorData, detail, _isLast) {
    //constructor(wrapper, title, indicatorData, detail) {
        super(parent, formattingConfig, wrapper, title, indicatorData, detail, _isLast);
        this.wrapper = wrapper;
        this.title = title;
        this.detail = detail;
        this.addIndicator();
    }
    addIndicator() {

        if (this.indicatorData.groups !== null && typeof this.indicatorData.groups !== 'undefined') {
            for (const [group, items] of Object.entries(this.indicatorData.groups)) {
                this.groups.push(group);
            }
        }


        const configuration = this.detail.indicators[this.title].chartConfiguration;
        const indicators = this.detail.indicators;

        let hasValues = this.indicatorData.data.some(function(e) { return e.count > 0 });

        if (hasValues) {
            let c = new Chart(this.Indicator, configuration, this.indicatorData, this.groups, this.indicatorNode, this.title);
            this.bubbleEvents(c, [
                'profile.chart.saveAsPng', 'profile.chart.valueTypeChanged',
                'profile.chart.download_csv', 'profile.chart.download_excel', 'profile.chart.download_json', 'profile.chart.download_kml',
                'point_tray.subindicator_filter.filter'
            ]);

            if (!isLast) {
                $(this.indicatorNode).removeClass('last');
            }

            this.wrapper.append(this.indicatorNode);
        }
    }
}

export class MarkdownBlock extends InfoBlock {
    constructor(parent, formattingConfig, wrapper, title, indicatorData, detail, _isLast) {
        super(parent, formattingConfig, wrapper, title, indicatorData, detail, _isLast);
        this.wrapper = wrapper;
        this.title = title;
        this.detail = detail;

        this.addMarkdown();
    }
    addMarkdown() {
        let c = new Text(this.Indicator, this.indicatorData);

        if (!isLast) {
            $(this.indicatorNode).removeClass('last');
        }

        this.wrapper.append(this.indicatorNode);
    }
}
