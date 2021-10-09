import {SubIndicator} from '../dataobjects'
import {checkIfSubCategoryHasChildren, checkIfCategoryHasChildren, Component} from '../utils'

const hideondeployClsName = 'hideondeploy';
let parentContainer = null;
let categoryTemplate = null;
let subCategoryTemplate = null;
let indicatorTemplate = null;
let indicatorItemTemplate = null;
const noDataWrapperClsName = 'data-mapper-content__no-data';
const loadingClsName = 'data-mapper-content__loading';
const DATASET_TYPES = {Quantitative: 'quantitative', Qualitative: 'qualitative'};

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
    categoryTemplate = $(".data-category")[0].cloneNode(true);
    subCategoryTemplate = $(".data-category__h2", categoryTemplate)[0].cloneNode(true);
    indicatorTemplate = $(".data-category__h2_content", subCategoryTemplate)[0].cloneNode(true);
    indicatorItemTemplate = $(".data-category__h4", subCategoryTemplate)[0].cloneNode(true);

    function addSubIndicators(wrapper, category, subcategory, indicator, groups, indicators, indicatorDetail) {

        $(".data-category__h3", wrapper).remove();
        $(".data-category__h4", wrapper).remove();

        if (groups !== null && typeof groups.subindicators !== 'undefined') {
            groups.subindicators.forEach((subindicator) => {
                let display = subindicatorHasData(subindicator, indicatorDetail);

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
                                versionData:indicatorDetail.version_data
                            })
                    });
                }
            });
        }
    }

    function addIndicators(wrapper, category, subcategory, indicators) {
        var newSubCategory = subCategoryTemplate.cloneNode(true);

        $(".data-category__h2_trigger div", newSubCategory).text(subcategory);
        wrapper.append(newSubCategory);

        var h3Wrapper = $(".data-category__h2_wrapper", newSubCategory);

        let indicatorClone = $(h3Wrapper).find('.data-category__h3')[0].cloneNode(true);
        $(".data-category__h3", h3Wrapper).remove();

        for (const [indicator, detail] of Object.entries(indicators)) {
            if (detail.dataset_content_type != DATASET_TYPES.Qualitative) {
                let newIndicator = indicatorClone.cloneNode(true);
                $('.truncate', newIndicator).text(indicator);
                $(h3Wrapper).append(newIndicator);
                const childWrapper = $(newIndicator).find('.data-category__h3_wrapper');

                let subindicators = detail.metadata.groups.filter((group) => group.name === detail.metadata.primary_group)[0];
                addSubIndicators(childWrapper, category, subcategory, indicator, subindicators, indicators, detail);
            }
        }
    }

    function addSubcategories(wrapper, category, subcategories) {
        var newCategory = categoryTemplate.cloneNode(true)
        $(newCategory).removeClass(hideondeployClsName);
        $(".data-category__h1_title div", newCategory).text(category);
        $('.' + loadingClsName).addClass('hidden');
        $('.' + noDataWrapperClsName).addClass('hidden');
        parentContainer.append(newCategory);
        var h2Wrapper = $(".data-category__h1_wrapper", newCategory);
        $(".data-category__h2", h2Wrapper).remove();

        for (const [subcategory, detail] of Object.entries(subcategories)) {
            let hasChildren = checkIfSubCategoryHasChildren(subcategory, detail);

            if (hasChildren) {
                let count = subindicatorsInSubCategory(detail);
                if (count > 0) {
                    addIndicators(h2Wrapper, category, subcategory, detail.indicators);
                }
            }
        }
    }

    function setActive(el) {
        resetActive();
        $(this).addClass("menu__link_h4--active")
    }

    function resetActive() {
        $(".menu__link_h4--active", parentContainer).removeClass("menu__link_h4--active");
    }

    function subindicatorHasData(subindicator, detail) {
        let hasData = false;
        for (const [geography, data] of Object.entries(detail.child_data)) {
            data.forEach((indicatorDataPoint) => {
                for (const [title, value] of Object.entries(indicatorDataPoint)) {
                    if (subindicator == value) {
                        hasData = true;
                    }
                }
            })
        }
        return hasData;
    }

    $(".data-menu__category").remove();
    let hasNoItems = true;
    let hiddenClass = hideondeployClsName;
    hiddenClass = 'hidden';
    $(parentContainer).find('.data-category').remove();

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
}

/**
 * This class is a stub for a menu component
 */
export class DataMapperMenu extends Component {
    constructor(parent) {
        super(parent)
    }

    showNoData() {
        $(parentContainer).empty();
        $('.' + loadingClsName).addClass('hidden');
        $('.' + noDataWrapperClsName).removeClass('hidden');

        this.triggerEvent('data_mapper_menu.nodata', this);
    }
}
