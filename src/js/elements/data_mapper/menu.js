import {
    Component
} from '../../utils'
import {sortBy} from 'lodash';
import {Category} from "./category";
import {SubCategory} from "./subcategory";
import {Indicator} from "./indicator";
import {SubIndicator} from './subindicator'
import {createRoot} from "react-dom/client";
import Watermark from "../../ui_components/watermark";
import React from "react";

let parentContainer = null;
let categoryTemplate = null;
let subCategoryTemplate = null;
let indicatorTemplate = null;
let indicatorItemTemplate = null;
const noDataWrapperClsName = 'data-mapper-content__no-data';
const loadingClsName = 'data-mapper-content__loading';

export function loadMenu(dataMapperMenu, data) {
    parentContainer = $(".data-mapper-content__list");
    categoryTemplate = $(".styles .data-category--v2")[0].cloneNode(true);
    subCategoryTemplate = $(".data-category__h2", categoryTemplate)[0].cloneNode(true);
    indicatorTemplate = $(".data-category__h2_content--v2", subCategoryTemplate)[0].cloneNode(true);
    indicatorItemTemplate = $(".data-category__h4", subCategoryTemplate)[0].cloneNode(true);

    function addIndicators(parent, indicators) {
        if (indicators === undefined) {
            return;
        }
        for (const indicatorDetail of sortBy(indicators, "order")) {
            const primaryGroup = indicatorDetail.metadata.groups.filter((g) => {
                return g.name === indicatorDetail.metadata.primary_group
            })[0];

            let metadata = indicatorDetail.metadata;
            metadata.indicatorDescription = indicatorDetail.description;
            let indicator = new Indicator(parent,
                indicatorDetail.label,
                indicatorDetail.id,
                indicatorDetail.choropleth_method,
                primaryGroup,
                indicatorDetail.version_data,
                indicatorDetail.metadata,
                indicatorDetail.choropleth_range,
                indicatorDetail.enable_linear_scrubber,
                indicatorDetail.chartConfiguration
            );
        }
    }

    function addSubcategories(parent, subcategories) {
        for (const subcategoryDetail of sortBy(subcategories, "order")) {
            let subCategory = new SubCategory(parent, subcategoryDetail.name, subcategoryDetail, dataMapperMenu);
            addIndicators(subCategory, subcategoryDetail.indicators);
        }
    }

    $(".data-menu__category").remove();
    let hasNoItems = true;
    let hiddenClass = 'hidden';
    $(parentContainer).find('.data-category--v2').remove();

    for (const categoryDetail of sortBy(data, "order")) {
        const categoryName = categoryDetail.name;
        let category = new Category(this, categoryName, categoryDetail);

        $('.' + noDataWrapperClsName).addClass(hiddenClass);
        hasNoItems = false;

        addSubcategories(category, categoryDetail.subcategories);
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
    constructor(parent, api) {
        super(parent);

        this._isLoading = false;
        this._api = api;

        this.addWatermark();
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

    get api() {
        return this._api;
    }

    addWatermark() {
        if ($('.data-mapper .watermark-wrapper').length > 0) {
            return;
        }

        let watermarkWrapper = document.createElement('div');
        $(watermarkWrapper)
            .addClass('watermark-wrapper');
        $('.data-mapper-content')
            .append(watermarkWrapper);

        let watermarkRoot = createRoot(watermarkWrapper);
        watermarkRoot.render(<Watermark/>);
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
        $(`.${noDataWrapperClsName} div`).last().text(
            'No data available to plot on the map for the selected geography.'
        );
        this.triggerEvent('data_mapper_menu.nodata', this);
    }

    loadAndAddSubIndicators(subcategory, profileId, geoCode, callBack) {
        const indicators = subcategory.children;
        indicators.forEach((indicator) => {
            if (indicator.isLoading) {
                //if !isLoading => subIndicators are already created
                this.api.getIndicatorChildData(profileId, geoCode, indicator.id)
                    .then((childData) => {
                        const parentNames = {
                            category: subcategory.parent.text,
                            subcategory: subcategory.text,
                            indicator: indicator.text
                        }
                        indicator.isLoading = false;
                        indicator.childData = childData;
                        this.addSubIndicators(indicator, parentNames, callBack)
                    })
            }
        })
    }

    addSubIndicators(parent, parentNames, callBack) {
        let primaryGroup = parent.primaryGroup;
        if (primaryGroup !== null && typeof primaryGroup.subindicators !== 'undefined') {
            primaryGroup.subindicators.forEach((subindicatorName) => {
                let subIndicator = new SubIndicator(parent,
                    false,
                    subindicatorName,
                    callBack,
                    parentNames);
            });
        }
    }
}
