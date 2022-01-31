import {SubIndicator} from '../dataobjects'
import {
    checkIfSubCategoryHasChildren,
    checkIfCategoryHasChildren,
    checkIfSubIndicatorHasChildren,
    Component, checkIfIndicatorHasChildren,
    isIndicatorExcluded
} from '../utils'

const hideondeployClsName = 'hideondeploy';
let parentContainer = null;
let categoryTemplate = null;
let subCategoryTemplate = null;
let indicatorTemplate = null;
let indicatorItemTemplate = null;
const noDataWrapperClsName = 'data-mapper-content__no-data';
const loadingClsName = 'data-mapper-content__loading';
const DATASET_TYPES = {Quantitative: 'quantitative', Qualitative: 'qualitative'};
const EXCLUDE_TYPES = {DataMapper: 'data mapper'};

function subindicatorsInSubCategory(subcategory) {

    let count = 0;
    const indicators = Object.values(subcategory.indicators);
    if (indicators.length > 0) {
        for (const idx in indicators) {
            let indicator = indicators[idx];
            count += subindicatorsInIndicator(indicator);
        }
    }

    return count;
}

function subindicatorsInIndicator(indicator) {
    return indicator.metadata.groups.length;
}


export function loadMenu(dataMapperMenu, data, subindicatorCallback) {
    parentContainer = $(".data-mapper-content__list");
    categoryTemplate = $(".styles .data-category--v2")[0].cloneNode(true);
    subCategoryTemplate = $(".data-category__h2", categoryTemplate)[0].cloneNode(true);
    indicatorTemplate = $(".data-category__h2_content--v2", subCategoryTemplate)[0].cloneNode(true);
    indicatorItemTemplate = $(".data-category__h4", subCategoryTemplate)[0].cloneNode(true);

    function addSubIndicators(wrapper, category, subcategory, indicator, groups, indicators, indicatorDetail) {
        $(".data-category__h3", wrapper).remove();
        $(".data-category__h4", wrapper).remove();

        if (groups !== null && typeof groups.subindicators !== 'undefined') {
            groups.subindicators.forEach((subindicator) => {
                let display = checkIfSubIndicatorHasChildren(subindicator, indicatorDetail);

                if (display) {
                    const newSubIndicatorElement = indicatorItemTemplate.cloneNode(true);
                    $(".truncate", newSubIndicatorElement).text(subindicator);
                    $(newSubIndicatorElement).attr('title', subindicator);

                    wrapper.append(newSubIndicatorElement);

                    const parents = {
                        category: category,
                        subcategory: subcategory,
                        indicator: indicator
                    }

                    $(newSubIndicatorElement).on("click", (el) => {
                        setActive(el);
                        if (subindicatorCallback != undefined)
                            subindicatorCallback({
                                el: el,
                                data: data,
                                indicatorTitle: indicator,
                                selectedSubindicator: subindicator,
                                indicators: indicators,
                                parents: parents,
                                choropleth_method: indicatorDetail.choropleth_method,
                                indicatorId: indicatorDetail.id,
                                versionData: indicatorDetail.version_data
                            })
                    });
                }
            });
        }
    }

    function addIndicators(wrapper, category, subcategory, indicators) {
        let newSubCategory = subCategoryTemplate.cloneNode(true);

        $(".data-category__h2_trigger--v2 div", newSubCategory).text(subcategory);
        $(newSubCategory).find('.data-category__h2_content--v2').addClass('is--closed');
        $(newSubCategory).find('.data-category__h2_trigger--v2').on('click', () => {
            $(newSubCategory).find('.data-category__h2_content--v2').toggleClass('is--closed');
        })
        wrapper.append(newSubCategory);

        let h3Wrapper = $(".data-category__h2_wrapper", newSubCategory);

        let indicatorClone = $(h3Wrapper).find('.data-category__h3')[0].cloneNode(true);
        $(".data-category__h3", h3Wrapper).remove();

        const triggerHeight = $('.data-category__h3_trigger--v2').height() + parseInt($('.data-category__h3_trigger--v2').css('margin-bottom'));
        let maxHeight = 0;

        for (const [indicator, detail] of Object.entries(indicators)) {
            const isExcluded = isIndicatorExcluded(detail, EXCLUDE_TYPES.DataMapper);
            if (detail.dataset_content_type !== DATASET_TYPES.Qualitative && checkIfIndicatorHasChildren(indicator, detail) && !isExcluded) {
                let newIndicator = indicatorClone.cloneNode(true);
                $('.truncate', newIndicator).text(indicator);

                $(newIndicator).find('.data-category__h3_content--v2').addClass('is--closed');
                $(newIndicator).find('.data-category__h3_trigger--v2').on('click', () => {
                    $(newIndicator).find('.data-category__h3_content--v2').toggleClass('is--closed');
                })

                $(h3Wrapper).append(newIndicator);
                const childWrapper = $(newIndicator).find('.data-category__h3_wrapper');

                let subindicators = detail.metadata.groups.filter((group) => group.name === detail.metadata.primary_group)[0];
                maxHeight += triggerHeight;
                addSubIndicators(childWrapper, category, subcategory, indicator, subindicators, indicators, detail);
            }
        }
    }

    function addSubcategories(wrapper, category, subcategories) {
        let newCategory = categoryTemplate.cloneNode(true)
        $(newCategory).removeClass(hideondeployClsName);
        $(newCategory).find('.data-category__h1_content--v2').addClass('is--closed');
        $(newCategory).find('.data-category__h1_trigger--v2').on('click', () => {
            $(newCategory).find('.data-category__h1_content--v2').toggleClass('is--closed');
        })
        $(".data-category__h1_title div", newCategory).text(category);
        $('.' + loadingClsName).addClass('hidden');
        $('.' + noDataWrapperClsName).addClass('hidden');
        parentContainer.append(newCategory);
        let h2Wrapper = $(".data-category__h1_wrapper", newCategory);
        $(".data-category__h2", h2Wrapper).remove();

        const triggerHeight = $('.data-category__h2_trigger--v2').height() + parseInt($('.data-category__h2_trigger--v2').css('margin-bottom'));
        let maxHeight = 0;

        for (const [subcategory, detail] of Object.entries(subcategories)) {
            let hasChildren = checkIfSubCategoryHasChildren(subcategory, detail);

            if (hasChildren) {
                let count = subindicatorsInSubCategory(detail);
                if (count > 0) {
                    maxHeight += triggerHeight;
                    addIndicators(h2Wrapper, category, subcategory, detail.indicators);
                }
            }
        }

        //$(newCategory).find('.data-category__h1_content--v2').css('max-height', maxHeight);
    }

    function setActive(el) {
        resetActive();
        $(this).addClass("menu__link_h4--active")
    }

    function resetActive() {
        $(".menu__link_h4--active", parentContainer).removeClass("menu__link_h4--active");
    }

    $(".data-menu__category").remove();
    let hasNoItems = true;
    let hiddenClass = hideondeployClsName;
    hiddenClass = 'hidden';
    $(parentContainer).find('.data-category--v2').remove();

    for (const [category, detail] of Object.entries(data)) {
        let hasChildren = checkIfCategoryHasChildren(category, detail)

        if (hasChildren) {
            if (!$('.' + noDataWrapperClsName).hasClass(hiddenClass)) {
                $('.' + noDataWrapperClsName).addClass(hiddenClass);
            }
            hasNoItems = false;

            addSubcategories(parentContainer, category, detail.subcategories)
        }
    }

    if (hasNoItems) {
        dataMapperMenu.showNoData()
    }

    dataMapperMenu.isLoading = false;
}

/**
 * This class is a stub for a menu component
 */
export class DataMapperMenu extends Component {
    constructor(parent) {
        super(parent);

        this._isLoading = false;
    }

    get isLoading() {
        return this._isLoading;
    }

    set isLoading(value) {
        if (value) {
            this.showLoadingState();
        } else {
            this.hideLoadingState();
        }

        this._isLoading = value;
    }

    hideLoadingState() {
        $(`.${loadingClsName}`).addClass('hidden');
        $('.data-mapper-content__list').removeClass('hidden');
    }

    showLoadingState() {
        $(`.${loadingClsName}`).removeClass('hidden');
        $('.data-mapper-content__list').addClass('hidden');
        $(`.${noDataWrapperClsName}`).addClass('hidden');
    }

    showNoData() {
        $(parentContainer).empty();
        $('.' + loadingClsName).addClass('hidden');
        $('.' + noDataWrapperClsName).removeClass('hidden');

        this.triggerEvent('data_mapper_menu.nodata', this);
    }
}
