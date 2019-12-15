const baseUrl = "http://localhost:8000";

function loadMenu(data) {
    var parentContainer = $(".data-menu__links")

    function setActive(el) {
        resetActive();
        $(this).addClass("menu__link_h4--active")
    }

    function resetActive() {
        $(".menu__link_h4--active", parentContainer).removeClass("menu__link_h4--active");
    }

    var categoryTemplate = $(".data-menu__category")[0].cloneNode(true);
    $(".data-menu__category").remove();

    data.forEach(function(el) {
        var newCategory = categoryTemplate.cloneNode(true)
        $(".link__h1_title div", newCategory).text(el.category);
        parentContainer.append(newCategory);
        var h2Wrapper = $(".category__dropdown_wrapper", newCategory);
        var subCategoryTemplate = $(".data-menu__subcategory", h2Wrapper)[0].cloneNode(true);
        $(".data-menu__subcategory", h2Wrapper).remove();

        el["sub-categories"].forEach(function(el2) {
            var newSubCategory = subCategoryTemplate.cloneNode(true);
            $(".data-menu__sub-category_trigger div", newSubCategory).text(el2.name);
            h2Wrapper.append(newSubCategory);

            var h3Wrapper = $(".sub-category__dropdown_wrapper", newSubCategory);
            var indicatorTemplate = $(".data-menu__indicator", h3Wrapper)[0].cloneNode(true);

            $(".data-menu__indicator", h3Wrapper).remove();
            el2["indicators"].forEach(function(el3) {
                var newIndicator = indicatorTemplate.cloneNode(true);
                $(".data-menu__indicator_trigger div", newIndicator).text(el3.name);
                h3Wrapper.append(newIndicator);

                var indicatorWrapper = $(".indicator__dropdown_wrapper", newIndicator);
                var subIndicatorTemplate = $(".data-menu__sub-indicator", newIndicator)[0].cloneNode(true);

                $(".data-menu__sub-indicator", indicatorWrapper).remove();
                $(".menu__link_h4--active", indicatorWrapper).remove();
                if (el3.classes != undefined) {

                    el3["classes"].forEach(function(el4) {
                        var newSubIndicator = subIndicatorTemplate.cloneNode(true);
                        $("div:nth-child(2)", newSubIndicator).text(el4);
                        indicatorWrapper.append(newSubIndicator);

                        $(newSubIndicator).on("click", setActive);
                    });
                } else {
                    indicatorWrapper.remove();
                }
            })
        });
    })
}

export default function load() {
    $.ajax({url: baseUrl + "/api/v1/profiles/1/"})
        .done(function(data) {
            console.log(data);
            loadMenu(data);
            Webflow.require('ix2').init()
        })
}
