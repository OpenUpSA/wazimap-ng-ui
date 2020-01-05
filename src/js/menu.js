export function loadMenu(data, subindicatorCallback) {
    var parentContainer = $(".data-menu__links")
    var categoryTemplate = $(".data-menu__category")[0].cloneNode(true);
    var subCategoryTemplate = $(".data-menu__subcategory", categoryTemplate)[0].cloneNode(true);
    var indicatorTemplate = $(".data-menu__indicator", subCategoryTemplate)[0].cloneNode(true);

    function addSubIndicators(wrapper, indicator, subindicators) {
        var indicatorLabel = indicator;
        var newIndicator = indicatorTemplate.cloneNode(true);
        $(".data-menu__indicator_trigger div", newIndicator).text(indicatorLabel);
        wrapper.append(newIndicator);

        var indicatorWrapper = $(".indicator__dropdown_wrapper", newIndicator);
        var subIndicatorTemplate = $(".data-menu__sub-indicator", newIndicator)[0].cloneNode(true);

        $(".data-menu__sub-indicator", indicatorWrapper).remove();
        $(".menu__link_h4--active", indicatorWrapper).remove();
        // TODO ????
        if (true) {
            subindicators.forEach((obj) => {
                var newSubIndicator = subIndicatorTemplate.cloneNode(true);
                var text = obj.key
                $("div:nth-child(2)", newSubIndicator).text(text);
                indicatorWrapper.append(newSubIndicator);

                $(newSubIndicator).on("click", (el) => {
                    setActive(el);
                    if (subindicatorCallback != undefined)
                        subindicatorCallback({
                            el: el,
                            data: data,
                            indicator: indicator,
                            subindicators: subindicators,
                            obj: obj
                        })
                });
            })
        } else {
            indicatorWrapper.remove();
        }
    }

    function addIndicators(wrapper, subcategory, indicators) {
        var newSubCategory = subCategoryTemplate.cloneNode(true);
        $(".data-menu__sub-category_trigger div", newSubCategory).text(subcategory);
        wrapper.append(newSubCategory);

        var h3Wrapper = $(".sub-category__dropdown_wrapper", newSubCategory);

        $(".data-menu__indicator", h3Wrapper).remove();
        for (const [indicator, subindicators] of Object.entries(indicators)) {
            addSubIndicators(h3Wrapper, indicator, subindicators);
        }
    }

    function addSubcategories(wrapper, category, subcategories) {
        var newCategory = categoryTemplate.cloneNode(true)
        $(".link__h1_title div", newCategory).text(category);
        parentContainer.append(newCategory);
        var h2Wrapper = $(".category__dropdown_wrapper", newCategory);
        $(".data-menu__subcategory", h2Wrapper).remove();

        for (const [subcategory, indicators] of Object.entries(subcategories)) {
            addIndicators(h2Wrapper, subcategory, indicators);
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

    for (const [category, subcategories] of Object.entries(data)) {
        addSubcategories(parentContainer, category, subcategories)
    }
}
