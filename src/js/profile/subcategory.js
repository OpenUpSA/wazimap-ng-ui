import {Indicator} from "./blocks/indicator";
import {Component, formatNumericalValue} from "../utils";
import {ContentBlock} from "./blocks/content_block";
import {HTMLBlock} from "./blocks/html_block";

let isFirst = false;
let scHeaderClone = null;

const subcategoryHeaderClass = '.sub-category-header';
const subcategoryTitleClass = '.indicator__title_wrapper h3';
const keyMetricParentClass = '.sub-category-header__key-metrics';
const keyMetricWrapperClass = '.sub-category-header__key-metrics_wrap';
const keyMetricClass = '.key-metric';
const descriptionTextClass = '.sub-category-header__description p';
const descriptionClass = '.sub-category-header__description';
const indicatorClass = '.profile-indicator';

export class Subcategory extends Component {
    constructor(parent, formattingConfig, wrapper, subcategory, detail, isFirst) {
        super(parent);

        scHeaderClone = $(subcategoryHeaderClass)[0].cloneNode(true);
        this._indicators = [];
        this._formattingConfig = formattingConfig;

        this.addKeyMetrics($(scHeaderClone), detail);
        this.addSubCategoryHeaders(wrapper, subcategory, detail, isFirst);
        this.addIndicators(wrapper, detail);
    }

    get indicators() {
        return this._indicators;
    }

    get formattingConfig() {
        return this._formattingConfig;
    }

    addSubCategoryHeaders = (wrapper, subcategory, detail, isFirst) => {
        let scHeader = scHeaderClone.cloneNode(true);

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

        wrapper.append(scHeader);
    }

    addIndicatorBlock(container, indicator, title, isLast) {
        let block = new Indicator(this, container, indicator, title, isLast);
        this.bubbleEvents(block, [
            'profile.chart.saveAsPng', 'profile.chart.valueTypeChanged',
            'profile.chart.download_csv', 'profile.chart.download_excel', 'profile.chart.download_json', 'profile.chart.download_kml',
            'point_tray.subindicator_filter.filter'
        ]);

        return block;
    }

    addHTMLBlock(container, indicator, title, html, isLast) {
        let block = new HTMLBlock(this, container, indicator, title, isLast)

        return block;
    }

    addIndicators = (wrapper, detail) => {
        let index = 0;
        let lastIndex = Object.entries(detail.indicators).length - 1;
        let isEmpty = JSON.stringify(detail.indicators) === JSON.stringify({});

        if (!isEmpty) {
            for (const [title, indicator] of Object.entries(detail.indicators)) {
                if (typeof indicator.data !== 'undefined') {
                    let isLast = index === lastIndex;
                    let block = null;
                    let indicatorContainer = $(indicatorClass)[0].cloneNode(true);
                    $(wrapper).append(indicatorContainer);
                    let metadata = indicator.metadata;
                    if (indicator.content_type == ContentBlock.BLOCK_TYPES.Indicator) {
                        block = this.addIndicatorBlock(indicatorContainer, indicator, title, isLast);
                    } else if (indicator.content_type == ContentBlock.BLOCK_TYPES.HTMLBlock) {
                        block = this.addHTMLBlock(indicatorContainer, indicator, title, isLast);
                    }

                    this._indicators.push(block);

                    index++;
                }
            }
        }
    }

    addKeyMetrics = (wrapper, detail) => {
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
            let item = metricTemplate.cloneNode(true);
            $('.key-metric__value div', item).text(formatNumericalValue(km.value, this.formattingConfig, km.method));
            $('.key-metric__title', item).text(km.label);
            $('.key-metric__description', item).addClass('hidden');
            metricWrapper.append(item);
        })
    }
}
