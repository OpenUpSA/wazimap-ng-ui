import {Indicator} from "./blocks/indicator";
import {Component, formatNumericalValue} from "../utils";
import {ContentBlock} from "./blocks/content_block";
import {HTMLBlock} from "./blocks/html_block";
import {assertNTemplates} from "../utils";
import {KeyMetric} from "./key_metric";

let isFirst = false;
let scHeaderClone = null;

const subcategoryHeaderClass = '.sub-category-header';
const subcategoryTitleClass = '.indicator__title_wrapper h3';
const keyMetricParentClass = '.sub-category-header__key-metrics';
const keyMetricWrapperClass = '.sub-category-header__key-metrics_wrap';
const keyMetricClass = '.key-metric';
const descriptionTextClass = '.sub-category-header__description p';
const descriptionClass = '.sub-category-header__description';
const indicatorClass = '.styles .profile-indicator';

export class Subcategory extends Component {
    constructor(parent, formattingConfig, wrapper, subcategory, detail, isFirst, geography, profileConfig) {
        super(parent);

        scHeaderClone = $(subcategoryHeaderClass)[0].cloneNode(true);
        this._indicators = [];
        this._formattingConfig = formattingConfig;
        this._geography = geography;
        this._profileConfig = profileConfig;
        this._isVisible = true;
        this._uiElements = [];

        this.addSubCategoryHeaders(wrapper, subcategory, detail, isFirst);
        this.addIndicators(wrapper, detail);

        this.prepareEvents();
    }

    prepareEvents() {
        this.parent.on('version.updated', (activeVersion) => {
            this.triggerEvent('version.updated', activeVersion);
        });
    }

    get indicators() {
        return this._indicators;
    }

    get formattingConfig() {
        return this._formattingConfig;
    }

    get geography() {
        return this._geography;
    }

    get isVisible() {
        return this._isVisible;
    }

    set isVisible(value) {
        if (value) {
            this.uiElements.forEach((ele) => {
                $(ele).show();
            })
        } else {
            this.uiElements.forEach((ele) => {
                $(ele).hide();
            })
        }

        this._isVisible = value;
    }

    get uiElements() {
        return this._uiElements;
    }

    addSubCategoryHeaders = (wrapper, subcategory, detail, isFirst) => {
        let scHeader = scHeaderClone.cloneNode(true);

        this.addKeyMetrics($(scHeader), detail);

        if (isFirst) {
            $(wrapper).find(subcategoryHeaderClass).remove();
        } else {
            $(scHeader).removeClass('first');
            $(scHeader).addClass('page-break-before');
        }

        $(subcategoryTitleClass, scHeader).text(subcategory);
        $(descriptionTextClass, scHeader).html(detail.description);

        if (detail.description === '') {
            $(descriptionClass, scHeader).addClass('hidden');
        } else {
            $(descriptionClass, scHeader).removeClass('hidden');
        }

        this.uiElements.push(scHeader);

        wrapper.append(scHeader);
    }

    addIndicatorBlock(container, indicator, title, isLast) {
        let block = new Indicator(this, container, indicator, title, isLast, this.geography, this._profileConfig.chart_attribution);
        this.bubbleEvents(block, [
            'profile.chart.saveAsPng', 'profile.chart.valueTypeChanged',
            'profile.chart.download_csv', 'profile.chart.download_excel', 'profile.chart.download_json', 'profile.chart.download_kml',
            'point_tray.subindicator_filter.filter'
        ]);

        return block;
    }

    addHTMLBlock(container, indicator, title, isLast) {
        let block = new HTMLBlock(this, container, indicator, title, isLast, this.geography)

        return block;
    }

    addIndicators = (wrapper, detail) => {
        let index = 0;
        let lastIndex = Object.entries(detail.indicators).length - 1;
        let isEmpty = JSON.stringify(detail.indicators) === JSON.stringify({});
        const $template = $(indicatorClass);
        assertNTemplates(2, $template);

        if (!isEmpty) {
            for (const [title, indicator] of Object.entries(detail.indicators)) {
                if (typeof indicator.data !== 'undefined') {
                    let isLast = index === lastIndex;
                    let block = null;

                    let indicatorContainer = $template[0].cloneNode(true);
                    $(wrapper).append(indicatorContainer);
                    let metadata = indicator.metadata;
                    if (indicator.content_type === ContentBlock.BLOCK_TYPES.Indicator) {
                        block = this.addIndicatorBlock(indicatorContainer, indicator, title, isLast);
                    } else if (indicator.content_type === ContentBlock.BLOCK_TYPES.HTMLBlock) {
                        block = this.addHTMLBlock(indicatorContainer, indicator, title, isLast);
                    }

                    this._indicators.push(block);

                    index++;
                }
            }
        }
    }

    addKeyMetrics = (wrapper, detail) => {
        let self = this;
        let key_metrics = detail.key_metrics;

        let metricWrapper = $(wrapper).find(keyMetricWrapperClass);
        $(metricWrapper).find(keyMetricClass).remove();

        if (typeof key_metrics === 'undefined' || key_metrics.length <= 0) {
            $(wrapper).find(keyMetricParentClass).addClass('hidden');

            return;
        }

        $(wrapper).find(keyMetricParentClass).removeClass('hidden');

        let metricTemplate = $(keyMetricClass)[0].cloneNode(true);

        key_metrics.forEach((km) => {
            new KeyMetric(self, km, metricTemplate, metricWrapper);
        })
    }
}
