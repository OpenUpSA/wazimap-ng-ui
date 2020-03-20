import {SubIndicator} from './dataobjects'


const hideondeployClsName = 'hideondeploy';
const parentContainer = $(".data-menu__links")
const categoryTemplate = $(".data-menu__category")[0].cloneNode(true);
const subCategoryTemplate = $(".data-menu__subcategory", categoryTemplate)[0].cloneNode(true);
const indicatorTemplate = $(".data-menu__indicator", subCategoryTemplate)[0].cloneNode(true);

// TODO this entire file needs to be refactored to use thhe observer pattern
export function loadMenu(data, subindicatorCallback) {
    if(!$('.data-menu__no-data').hasClass(hideondeployClsName)){
        $('.data-menu__no-data').addClass(hideondeployClsName);
    }

    function addSubIndicators(wrapper, indicator, subindicators) {
        const indicatorLabel = indicator;
        const newIndicatorElement = indicatorTemplate.cloneNode(true);
        $(".data-menu__indicator_trigger div", newIndicatorElement).text(indicatorLabel);
        wrapper.append(newIndicatorElement);

        const indicatorWrapperElement = $(".indicator__dropdown_wrapper", newIndicatorElement);
        const subIndicatorTemplate = $(".data-menu__sub-indicator", newIndicatorElement)[0].cloneNode(true);

        if (subindicators == undefined || !Array.isArray(subindicators)) {
            console.log("Missing subindicators")
        } else {
            $(".data-menu__sub-indicator", indicatorWrapperElement).remove();
            $(".menu__link_h4--active", indicatorWrapperElement).remove();
            subindicators.forEach(subIndicator => {

                const newSubIndicatorElement = subIndicatorTemplate.cloneNode(true);
                $("div:nth-child(2)", newSubIndicatorElement).text(subIndicator.label);
                indicatorWrapperElement.append(newSubIndicatorElement);

                $(newSubIndicatorElement).on("click", (el) => {
                    setActive(el);
                    if (subindicatorCallback != undefined)
                        subindicatorCallback({
                            el: el,
                            data: data,
                            indicator: indicator,
                            subindicators: subindicators,
                            obj: subIndicator
                        })
                });
            })
        }
    }

    function addIndicators(wrapper, subcategory, indicators) {
        var newSubCategory = subCategoryTemplate.cloneNode(true);
        $(".data-menu__sub-category_trigger div", newSubCategory).text(subcategory);
        wrapper.append(newSubCategory);

        var h3Wrapper = $(".sub-category__dropdown_wrapper", newSubCategory);

        $(".data-menu__indicator", h3Wrapper).remove();
        for (const [indicator, detail] of Object.entries(indicators)) {
            if (detail.subindicators.length > 0) {
                addSubIndicators(h3Wrapper, indicator, detail.subindicators);
            }
        }
    }

    function addSubcategories(wrapper, category, subcategories) {
        var newCategory = categoryTemplate.cloneNode(true)
        $(newCategory).removeClass(hideondeployClsName);
        $(".link__h1_title div", newCategory).text(category);
        parentContainer.append(newCategory);
        var h2Wrapper = $(".category__dropdown_wrapper", newCategory);
        $(".data-menu__subcategory", h2Wrapper).remove();

        for (const [subcategory, detail] of Object.entries(subcategories)) {
            addIndicators(h2Wrapper, subcategory, detail.indicators);
        };
    }

    function setActive(el) {
        resetActive();
        $(this).addClass("menu__link_h4--active")
    }

    function resetActive() {
        $(".menu__link_h4--active", parentContainer).removeClass("menu__link_h4--active");
    }

    $(".data-menu__category").remove();

    for (const [category, detail] of Object.entries(data)) {
        addSubcategories(parentContainer, category, detail.subcategories)
    }
}
