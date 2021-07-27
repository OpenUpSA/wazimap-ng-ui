import { Component } from '../../utils';
import {isNull} from '../../utils';

const sourceClass = '.data-source';
const indicatorTitleClass = '.profile-indicator__title h4';
const chartDescClass = '.profile-indicator__chart_description p';

export class ContentBlock extends Component {
    static BLOCK_TYPES = {Indicator: 'indicator', HTMLBlock: 'html'};

    constructor(parent, container, indicator, title, isLast) {
        super(parent);

        this._container = container;
        this._indicator = indicator;
        this._title = title;
        this._isLast = isLast;
    }

    get container() {
        return this._container;
    }

    get indicator() {
        return this._indicator;
    }

    get title() {
        return this._title;
    }

    get isLast() {
        return this._isLast;
    }

    get metadata() {
        return this.indicator.metadata;
    }

    get metadata() {
        return this.indicator.metadata;
    }

    get description() {
        return this.indicator.description;
    }

    createMetaData() {
        const isLink = !isNull(this.metadata.url);
        if (isLink) {
            let ele = $('<a></a>');
            $(ele).text(this.metadata.source);
            $(ele).attr('href', this.metadata.url);
            $(ele).attr('target', '_blank');
            $(sourceClass, this.container).html(ele);
        }
        else
            $(sourceClass, this.container).text(this.metadata.source);
    }

    createTitle() {
        $(indicatorTitleClass, this.container).text(this.title);
    }

    createDescription() {
        $(chartDescClass, this.container).html(this.description);
    }

    prepareDomElements() {
        this.createTitle();
        this.createMetaData();
        this.createDescription();

        if (!this.isLast) {
            $(this.container).removeClass('last');
        }

    }
}
