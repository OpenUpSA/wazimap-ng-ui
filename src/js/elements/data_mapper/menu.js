import {
    Component,
    isIndicatorExcluded
} from '../../utils'
import {Category} from "./category";
import {SubCategory} from "./subcategory";
import {Indicator} from "./indicator";
import {SubIndicator} from './subindicator'

let parentContainer = null;
let categoryTemplate = null;
let subCategoryTemplate = null;
let indicatorTemplate = null;
let indicatorItemTemplate = null;
const noDataWrapperClsName = 'data-mapper-content__no-data';
const loadingClsName = 'data-mapper-content__loading';
const DATASET_TYPES = {Quantitative: 'quantitative', Qualitative: 'qualitative'};
const EXCLUDE_TYPES = {DataMapper: 'data mapper'};

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
        for (const [indicatorName, detail] of Object.entries(indicators)) {
            const isExcluded = isIndicatorExcluded(detail, EXCLUDE_TYPES.DataMapper);
            if (detail.dataset_content_type !== DATASET_TYPES.Qualitative && !isExcluded) {
                const primaryGroup = detail.metadata.groups.filter((g) => {
                    return g.name === detail.metadata.primary_group
                })[0];
                let indicator = new Indicator(parent,
                    indicatorName,
                    detail.id,
                    detail.choropleth_method,
                    primaryGroup,
                    detail.version_data,
                    detail.metadata,
                    detail.choropleth_range,
                    detail.enable_linear_scrubber,
                    detail.chartConfiguration
                );
            }
        }
    }

    function addSubcategories(parent, subcategories) {
        for (const [subCategoryName, detail] of Object.entries(subcategories)) {
            let subCategory = new SubCategory(parent, subCategoryName, detail, dataMapperMenu);

            addIndicators(subCategory, detail.indicators);
        }
    }

    $(".data-menu__category").remove();
    let hasNoItems = true;
    let hiddenClass = 'hidden';
    $(parentContainer).find('.data-category--v2').remove();

    for (const [categoryName, detail] of Object.entries(data)) {
        let category = new Category(this, categoryName, detail);

        $('.' + noDataWrapperClsName).addClass(hiddenClass);
        hasNoItems = false;

        addSubcategories(category, detail.subcategories);
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

                console.log({
                    'indicator': parent.text,
                    'subindicator': subIndicator.text,
                    'hasData': subIndicator.hasData
                })
            });
        }
    }
}
