import {Indicator} from "./blocks/indicator";
import {Component} from "../utils";
import {ContentBlock} from "./blocks/content_block";
import {HTMLBlock} from "./blocks/html_block";
import {assertNTemplates} from "../utils";
import {KeyMetric} from "./key_metric";
import {sortBy} from 'lodash';

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
    constructor(
        parent,
        formattingConfig,
        wrapper,
        subcategory,
        detail,
        isFirst,
        geography,
        profileConfig,
        addLockButton = true,
        restrictValues = {},
        defaultFilters = [],
        hiddenIndicators = []
    ) {
        super(parent);
        scHeaderClone = $(subcategoryHeaderClass)[0].cloneNode(true);
        this._indicators = [];
        this._formattingConfig = formattingConfig;
        this._geography = geography;
        this._profileConfig = profileConfig;
        this._isVisible = true;
        this._uiElements = [];
        this._scHeader = null;
        this._hasKeyMetrics = false;

        this.addSubCategoryHeaders(wrapper, subcategory, detail, isFirst);
        this.addIndicators(wrapper, detail, addLockButton, restrictValues, defaultFilters, hiddenIndicators);
        this.prepareEvents();
    }

    prepareEvents() {
        this.parent.on('version.updated', (activeVersion) => {
            this.triggerEvent('version.updated', activeVersion);
        });
    }

    get filteredIndicators() {
        return this.parent.filteredIndicators;
    }

    get siteWideFilters() {
        return this.parent.siteWideFilters;
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

    get hasKeyMetrics() {
        return this._hasKeyMetrics;
    }

    set hasKeyMetrics(value) {
        this._hasKeyMetrics = value;
    }

    updateVisibility = () => {
        this.isVisible = Object.values(this._indicators).filter(
            indicator => indicator.isVisible
        ).length > 0 || this.hasKeyMetrics;
        this.parent.updateVisibility();
    }

    updateDomElements = () => {
        $(this._scHeader).parents('.section').find(subcategoryHeaderClass).removeClass('first');
        $(this._scHeader).removeClass('page-break-before').addClass('first');
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
        this._scHeader = scHeader;
    }

    addIndicatorBlock(container, indicator, title, isLast, addLockButton, restrictValues, defaultFilters, hiddenIndicators) {
        let block = new Indicator(
            this,
            container,
            indicator,
            title,
            isLast,
            this.geography,
            this._profileConfig.chart_attribution,
            addLockButton,
            restrictValues,
            defaultFilters,
            hiddenIndicators
        );
        this.bubbleEvents(block, [
            'profile.chart.saveAsPng', 'profile.chart.valueTypeChanged',
            'profile.chart.download_csv', 'profile.chart.download_excel', 'profile.chart.download_json', 'profile.chart.download_kml',
            'point_tray.subindicator_filter.filter', 'profile.chart.filtered', 'filterRow.created.new', 'filterRow.filter.unlocked', 'filterRow.filter.locked'
        ]);

        return block;
    }

    addHTMLBlock(container, indicator, title, isLast, hiddenIndicators) {
        let block = new HTMLBlock(this, container, indicator, title, isLast, this.geography, hiddenIndicators)

        return block;
    }

    addIndicators = (wrapper, detail, addLockButton, restrictValues, defaultFilters, hiddenIndicators) => {
        let index = 0;
        let lastIndex = Object.entries(detail.indicators).length - 1;
        let isEmpty = JSON.stringify(detail.indicators) === JSON.stringify({});
        const $template = $(indicatorClass);
        assertNTemplates(2, $template);
        if (!isEmpty) {
            for (const indicator of sortBy(detail.indicators, "order")) {
                const title = Object.keys(detail.indicators).filter(k => detail.indicators[k] === indicator)[0];
                if (typeof indicator.data !== 'undefined' && indicator.data.length > 0) {
                    let isLast = index === lastIndex;
                    let block = null;

                    let indicatorContainer = $template[0].cloneNode(true);
                    $(wrapper).append(indicatorContainer);
                    let metadata = indicator.metadata;
                    if (indicator.content_type === ContentBlock.BLOCK_TYPES.Indicator) {
                        block = this.addIndicatorBlock(indicatorContainer, indicator, title, isLast, addLockButton, restrictValues, defaultFilters, hiddenIndicators);
                    } else if (indicator.content_type === ContentBlock.BLOCK_TYPES.HTMLBlock) {
                        block = this.addHTMLBlock(indicatorContainer, indicator, title, isLast, hiddenIndicators);
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
        this.hasKeyMetrics = true;
    }
}
