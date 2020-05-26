import {SubIndicator} from '../dataobjects'


const hideondeployClsName = 'hideondeploy';
const parentContainer = $(".data-mapper-content__list");
const categoryTemplate = $(".data-category")[0].cloneNode(true);
const subCategoryTemplate = $(".data-category__h2", categoryTemplate)[0].cloneNode(true);
const indicatorTemplate = $(".data-category__h2_content", subCategoryTemplate)[0].cloneNode(true);
const indicatorItemTemplate = $(".data-category__h3", subCategoryTemplate)[0].cloneNode(true);
const noDataWrapperClsName = 'data-menu__no-data';
const loadingClsName = 'data-mapper-content__loading';

function subindicatorsInCategory(category) {
    let count = 0;
    let subcategories = Object.values(category.subcategories);
    for (const idx in subcategories) {
        let subcategory = subcategories[idx];
        count += subindicatorsInSubCategory(subcategory);
    }

    return count;
}

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
    return Object.values(indicator.subindicators).length;
}

function indicatorHasChildren(indicator) {
    const subindicators = indicator.subindicators;

    if (subindicators == undefined || subindicators.length == 0)
        return false

    const hasChildren = Object.entries(subindicators).every(item => {
        const subindicator = item[1];
        return subindicator.children != undefined && Object.values(subindicator.children).length > 0
    })

    return hasChildren
}

// TODO this entire file needs to be refactored to use thhe observer pattern
export function loadMenu(data, subindicatorCallback) {
    function addSubIndicators(wrapper, indicator, subindicators, indicators) {
        const indicatorLabel = indicator;
        const newIndicatorElement = indicatorTemplate.cloneNode(true);
        $(".data-menu__indicator_trigger div", newIndicatorElement).text(indicatorLabel);

        const subIndicatorTemplate = indicatorItemTemplate.cloneNode(true);

        if (subindicators == undefined || !Array.isArray(subindicators)) {
            console.log("Missing subindicators")
        } else {
            $(".data-category__h3", wrapper).remove();
            $(".menu__link_h4--active", wrapper).remove();

            subindicators.forEach(subIndicator => {
                if (subIndicator.label !== '') {
                    const newSubIndicatorElement = subIndicatorTemplate.cloneNode(true);
                    $(".truncate", newSubIndicatorElement).text(subIndicator.label);
                    $(newSubIndicatorElement).attr('title', subIndicator.label);

                    wrapper.append(newSubIndicatorElement);

                    $(newSubIndicatorElement).on("click", (el) => {
                        setActive(el);
                        if (subindicatorCallback != undefined)
                            subindicatorCallback({
                                el: el,
                                data: data,
                                indicatorTitle: indicator,
                                subindicators: subindicators,
                                obj: subIndicator,
                                indicators: indicators
                            })
                    });
                }
            })
        }
    }

    function addIndicators(wrapper, subcategory, indicators) {
        var newSubCategory = subCategoryTemplate.cloneNode(true);

        $(".data-category__h2_trigger div", newSubCategory).text(subcategory);
        wrapper.append(newSubCategory);

        var h3Wrapper = $(".data-category__h2_wrapper", newSubCategory);

        $(".data-menu__indicator", h3Wrapper).remove();
        for (const [indicator, detail] of Object.entries(indicators)) {

            if (!indicatorHasChildren(detail))
                continue

            if (detail.subindicators.length > 0) {
                addSubIndicators(h3Wrapper, indicator, detail.subindicators, indicators);
            }
        }
    }

    function addSubcategories(wrapper, category, subcategories) {
        var newCategory = categoryTemplate.cloneNode(true)
        $(newCategory).removeClass(hideondeployClsName);
        $(".data-category__h1_title div", newCategory).text(category);
        $('.' + loadingClsName).addClass('hidden');
        parentContainer.append(newCategory);
        var h2Wrapper = $(".data-category__h1_wrapper", newCategory);
        $(".data-category__h2", h2Wrapper).remove();

        for (const [subcategory, detail] of Object.entries(subcategories)) {
            let count = subindicatorsInSubCategory(detail);
            if (count > 0)
                addIndicators(h2Wrapper, subcategory, detail.indicators);
        }
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
    $(parentContainer).find('.data-category').remove();


    for (const [category, detail] of Object.entries(data)) {
        let count = subindicatorsInCategory(detail);

        if (count > 0) {
            if (!$('.' + noDataWrapperClsName).hasClass(hideondeployClsName)) {
                $('.' + noDataWrapperClsName).addClass(hideondeployClsName);
            }
            hasNoItems = false;
            addSubcategories(parentContainer, category, detail.subcategories)
        }
    }

    if (hasNoItems) {
        if ($('.' + noDataWrapperClsName).hasClass(hideondeployClsName)) {
            $('.' + noDataWrapperClsName).removeClass(hideondeployClsName);
        }
    }
}
