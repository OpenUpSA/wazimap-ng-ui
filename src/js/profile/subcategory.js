import {Indicator} from "./indicator";
import {Observable} from "../utils";

let isFirst = false;
let scHeaderClone = null;

const subcategoryHeaderClass = '.sub-category-header';
const subcategoryTitleClass = '.indicator__title_wrapper h3';
const keyMetricParentClass = '.sub-category-header__key-metrics';
const keyMetricWrapperClass = '.sub-category-header__key-metrics_wrap';
const keyMetricClass = '.key-metric';
const descriptionTextClass = '.sub-category-header__description p';
const descriptionClass = '.sub-category-header__description';

export class Subcategory extends Observable {
    constructor(wrapper, subcategory, detail, _isFirst) {
        super();

        scHeaderClone = $(subcategoryHeaderClass)[0].cloneNode(true);
        isFirst = _isFirst;

        this.addKeyMetrics($(scHeaderClone), detail);
        this.addSubCategoryHeaders(wrapper, subcategory, detail, isFirst);
        this.addIndicators(wrapper, detail);
    }

    addSubCategoryHeaders = (wrapper, subcategory, detail, isFirst) => {
        let scHeader = scHeaderClone.cloneNode(true);

        if (isFirst) {
            $(wrapper).find(subcategoryHeaderClass).remove();
        } else {
            $(scHeader).removeClass('first');
        }

        $(subcategoryTitleClass, scHeader).text(subcategory);
        $(descriptionTextClass, scHeader).text(detail.description);

        if (detail.description === '') {
            $(descriptionClass, scHeader).addClass('hidden');
        }

        wrapper.append(scHeader);
    }

    addIndicators = (wrapper, detail) => {
        let index = 0;
        let lastIndex = Object.entries(detail.indicators).length - 1;

        for (const [title, indicatorData] of Object.entries(detail.indicators)) {
            let isLast = index === lastIndex;
            let i = new Indicator(wrapper, title, indicatorData, detail, isLast);
            this.bubbleEvent(i, 'profile.chart.saveAsPng');
            index++;
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
            $('.key-metric__value div', item).text(km.value);
            $('.key-metric__title', item).text(km.label);
            $('.key-metric__description', item).addClass('hidden');
            metricWrapper.append(item);
        })
    }
}