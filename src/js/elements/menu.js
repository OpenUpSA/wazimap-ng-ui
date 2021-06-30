import { Component, Observable } from '../utils';

const hideondeployClsName = 'hideondeploy';
const parentContainer = $(".data-mapper-content__list");
const categoryTemplate = $(".data-category")[0].cloneNode(true);
const subCategoryTemplate = $(".data-category__h2", categoryTemplate)[0].cloneNode(true);
const indicatorItemTemplate = $(".data-category__h4", subCategoryTemplate)[0].cloneNode(true);
const noDataWrapperClsName = 'data-mapper-content__no-data';
const loadingClsName = 'data-mapper-content__loading';


class DataMapperMenuModel extends Observable {
  static EVENTS = {}
  constructor() {
    super();
  }


  _subindicatorsInIndicator(groups) {
    return groups.length;
  }

  subindicatorsInSubCategory(subcategory) {
    const indicators = Object.values(subcategory.indicators);
    let count = 0;
    if (indicators.length > 0) {
      for (const idx in indicators) {
        let groups = indicators[idx].metadata.groups;
        count += this._subindicatorsInIndicator(groups);
      }
    }

    return count;
  }

  checkIfSubCategoryHasChildren(detail) {
    let hasChildren = false;
    for (const data of Object.values(detail.indicators)) {
      if (!hasChildren && data.child_data !== undefined) {
        for (const arr of Object.values(data.child_data)) {
          hasChildren = hasChildren || arr.length > 0;
        }
      }
    }

    return hasChildren;
  }

  checkIfCategoryHasChildren(detail) {
    for (const subcategoryDetail of Object.values(detail.subcategories)) {
      if (this.checkIfSubCategoryHasChildren(subcategoryDetail))
        return true
    }

    return false
  }

}


// TODO this entire file needs to be refactored to use thhe observer pattern
export class DataMapperMenu extends Component {
  constructor(parent) {
    super(parent);
    this._data = null;
    this._subindicatorCallback = null;
  }

  init(data, subindicatorCallback) {
    this._data = data;
    this._subindicatorCallback = subindicatorCallback;
    this._model = new DataMapperMenuModel();
    this.main();
  }

  get model() {
    return this._model;
  }

  addSubIndicators(wrapper, category, subcategory, indicator, groups, indicators, choropleth_method, indicatorId) {
    $(".data-category__h3", wrapper).remove();
    $(".data-category__h4", wrapper).remove();

    if (groups !== null && typeof groups.subindicators !== 'undefined') {
      groups.subindicators.forEach((subindicator) => {
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
          this.setActive(el);
          if (this._subindicatorCallback != undefined)
            this._subindicatorCallback({
              el: el,
              data: this._data,
              indicatorTitle: indicator,
              selectedSubindicator: subindicator,
              indicators: indicators,
              parents: parents,
              choropleth_method: choropleth_method,
              indicatorId: indicatorId
            })
        });
      });
    }
  }

  addIndicators(wrapper, category, subcategory, indicators) {
    var newSubCategory = subCategoryTemplate.cloneNode(true);

    $(".data-category__h2_trigger div", newSubCategory).text(subcategory);
    wrapper.append(newSubCategory);

    var h3Wrapper = $(".data-category__h2_wrapper", newSubCategory);

    let indicatorClone = $(h3Wrapper).find('.data-category__h3')[0].cloneNode(true);
    $(".data-category__h3", h3Wrapper).remove();

    for (const [indicator, detail] of Object.entries(indicators)) {
      let newIndicator = indicatorClone.cloneNode(true);
      $('.truncate', newIndicator).text(indicator);
      $(h3Wrapper).append(newIndicator);
      const childWrapper = $(newIndicator).find('.data-category__h3_wrapper');

      let subindicators = detail.metadata.groups.filter((group) => group.name === detail.metadata.primary_group)[0];
      this.addSubIndicators(childWrapper, category, subcategory, indicator, subindicators, indicators, detail.choropleth_method, detail.id);
    }
  }


  addSubcategories(category, subcategories) {
    var newCategory = categoryTemplate.cloneNode(true)
    $(newCategory).removeClass(hideondeployClsName);
    $(".data-category__h1_title div", newCategory).text(category);
    $('.' + loadingClsName).addClass('hidden');
    $('.' + noDataWrapperClsName).addClass('hidden');
    parentContainer.append(newCategory);
    var h2Wrapper = $(".data-category__h1_wrapper", newCategory);
    $(".data-category__h2", h2Wrapper).remove();

    for (const [subcategory, detail] of Object.entries(subcategories)) {
      let hasChildren = this.model.checkIfSubCategoryHasChildren(detail);

      if (hasChildren) {
        let count = this.model.subindicatorsInSubCategory(detail);
        if (count > 0) {
          this.addIndicators(h2Wrapper, category, subcategory, detail.indicators);
        }
      }
    }
  }

  setActive(el) {
    this.resetActive();
    $(this).addClass("menu__link_h4--active")
  }

  resetActive() {
    $(".menu__link_h4--active", parentContainer).removeClass("menu__link_h4--active");
  }


  main() {
    $(".data-menu__category").remove();
    let hasNoItems = true;
    $(parentContainer).find('.data-category').remove();
    for (const [category, detail] of Object.entries(this._data)) {
      let hasChildren = this.model.checkIfCategoryHasChildren(detail);
      if (hasChildren) {
        this.hideNoDataMessage()
        hasNoItems = false;
        this.addSubcategories(category, detail.subcategories)
      }
    }

    if (hasNoItems) {
      this.showNoDataMessage()
    }
  }

  hideNoDataMessage() {
    let hiddenClass = hideondeployClsName;
    hiddenClass = 'hidden';
    if (!$('.' + noDataWrapperClsName).hasClass(hiddenClass)) {
      $('.' + noDataWrapperClsName).addClass(hiddenClass);
    }
  }

  showNoDataMessage() {
    $(parentContainer).empty();
    $('.' + loadingClsName).addClass('hidden');
    $('.' + noDataWrapperClsName).removeClass('hidden');

    this.triggerEvent('data_mapper_menu.nodata', this);
  }
}
