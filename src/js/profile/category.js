import {Subcategory} from "./subcategory";

let categoryTemplate = null;
let profileWrapper = null;
let removePrevCategories = false;

const categoryClass = 'div.section';
const categoryTitleClass = '.section-header__text h2';
const keyMetricWrapperClass = '.indicator-header__key-metrics';
const keyMetricClass = '.key-metric';

export class Category {
    constructor(category, detail, _profileWrapper, _id, _removePrevCategories) {
        categoryTemplate = $(categoryClass)[0].cloneNode(true);
        profileWrapper = _profileWrapper;
        removePrevCategories = _removePrevCategories;

        this.id = _id;

        this.prepareDomElements();
        this.addCategory(category, detail);
    }

    prepareDomElements = () => {
        if (removePrevCategories) {
            profileWrapper.find(categoryClass).remove();
        }
    }

    addCategory = (category, detail) => {
        const newCategorySection = categoryTemplate.cloneNode(true);
        const sectionHeader = $('.section-header')[0].cloneNode(true);
        const indicatorHeader = $('.indicator-header')[0].cloneNode(true);

        $(newCategorySection).html('');
        $(newCategorySection).append(this.getSectionLink());
        $(newCategorySection).append(sectionHeader);
        $(newCategorySection).append(indicatorHeader);

        $(categoryTitleClass, newCategorySection).text(category);

        this.loadSubcategories(newCategorySection, detail);
        this.addKeyMetrics(newCategorySection, detail);
        this.addMetricsDivider(newCategorySection);

        profileWrapper.append(newCategorySection);
    }

    getSectionLink = () => {
        const sectionLink = $('.section-link')[0].cloneNode(true);
        $(sectionLink).attr('id', this.id);

        return sectionLink;
    }

    loadSubcategories = (wrapper, detail) => {
        let index = 0;
        let lastIndex = Object.entries(detail.subcategories).length - 1;
        for (const [subcategory, detail] of Object.entries(detail.subcategories)) {
            let isLast = index === lastIndex;
            let sc = new Subcategory(wrapper, subcategory, detail, isLast);
            index++;
        }
    }

    addKeyMetrics = (container, detail) => {
        let key_metrics = [];
        for (const [description, subcategories] of Object.entries(detail.subcategories)) {
            if (typeof subcategories.key_metrics !== 'undefined') {
                key_metrics = key_metrics.concat(subcategories.key_metrics);
            }
        }

        let metricTemplate = $(keyMetricClass)[0].cloneNode(true);
        $(container).find('.indicator-header__description p').text(detail.description);
        const wrapper = $(keyMetricWrapperClass, container);
        $(keyMetricClass, wrapper).remove();

        if (key_metrics != undefined && Array.isArray(key_metrics) && key_metrics.length > 0) {
            key_metrics.forEach(el => {
                if (typeof el !== 'undefined') {
                    let metric = metricTemplate.cloneNode(true)
                    $('.key-metric_value div', metric).text(el.value);
                    $('.key-metric_title', metric).text(el.label);
                    $('.key-metric_description div', metric).text('');
                    wrapper.append(metric)
                }
            })
            // Show key metrics title
            $(wrapper).find('.indicator__key-metrics_title').show();
        } else {
            // Hide key metrics title
            $(wrapper).find('.indicator__key-metrics_title').hide();
        }
    }

    addMetricsDivider = (container) => {
        /*
        let divider = $('.indicator-header__key-metrics_divider')[0].cloneNode(true);
        container.append(divider);
         */
    }
}