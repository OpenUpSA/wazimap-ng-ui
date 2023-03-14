import {
    Component
} from '../../utils'
import {sortBy, isEmpty} from 'lodash';
import {createRoot} from "react-dom/client";
import Watermark from "../../ui_components/watermark";
import IndicatorCategoryTreeView from "./components/indicator_tree_view";
import React from "react";


import TreeView from '@mui/lab/TreeView';
import TreeItem from '@mui/lab/TreeItem';
import Box from "@mui/material/Box";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';



let parentContainer = null;
let categoryTemplate = null;
let subCategoryTemplate = null;
let indicatorTemplate = null;
let indicatorItemTemplate = null;
const noDataWrapperClsName = 'data-mapper-content__no-data';
const loadingClsName = 'data-mapper-content__loading';

export function loadMenu(dataMapperMenu, data) {

    const filterIndicatorData = (indicatorData, hiddenIndicators) => {
      let newData = {};
      Object.keys(indicatorData).forEach(function(categoryKey, categoryIndex) {
        let subcategories = {};

        let category = indicatorData[categoryKey];
        Object.keys(category.subcategories).forEach(function(subcategoryKey, subcategoryIndex) {
          let subcategoryValue = category.subcategories[subcategoryKey];
          let indicators = subcategoryValue.indicators;
          let newIndicators = {};
          Object.keys(indicators).forEach(function(indicatorKey, indicatorIndex) {
            let indicatorValue = indicators[indicatorKey];
            if (!hiddenIndicators.includes(indicatorValue.id)){
              newIndicators[indicatorKey] = indicatorValue;
            }
          });
          if (!isEmpty(newIndicators)){
            subcategoryValue["indicators"] = newIndicators;
            subcategories[subcategoryKey] = subcategoryValue;
          }
        });

        if(!isEmpty(subcategories)){
          category["subcategories"] = subcategories
          newData[categoryKey] = category
        }
      });
      return sortBy(newData, "order");
    }
    const profileIndicators = filterIndicatorData(data, dataMapperMenu.controller.hiddenIndicators);

    if (isEmpty(data)){
      dataMapperMenu.showNoData()
    } else {
      dataMapperMenu.dataMapperRoot.render(
        <TreeView
          defaultCollapseIcon={<ArrowDropDownIcon />}
          defaultExpandIcon={<ArrowRightIcon />}
        >
          {profileIndicators.length >  0 && profileIndicators.map(
            (item, key) => {
              return (
                <IndicatorCategoryTreeView
                  category={item}
                  key={key}
                  api={dataMapperMenu.api}
                  controller={dataMapperMenu.controller}
                />
              )
            })
          }
        </TreeView>
      );
    }
    dataMapperMenu.isLoading = false;
}

/**
 * This class is a stub for a menu component
 */
export class DataMapperMenu extends Component {
    constructor(parent, api, watermarkEnabled, controller) {
        super(parent);

        this._isLoading = false;
        this._api = api;
        this._subIndicators = [];
        this._dataMapperRoot = false;
        this._controller = controller;

        if (watermarkEnabled) {
            this.addWatermark();
        }
        this.addDataMapperMenuRoot();
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

    get dataMapperRoot() {
      return this._dataMapperRoot;
    }

    set dataMapperRoot(value) {
      return this._dataMapperRoot = value;
    }

    get api() {
        return this._api;
    }

    get controller() {
      return this._controller;
    }

    get subIndicators() {
        return this._subIndicators;
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

    addDataMapperMenuRoot() {
        let dataMapperElement = document.getElementsByClassName("data-mapper-content__list");
        if (dataMapperElement.length > 0){
          this.dataMapperRoot = createRoot(dataMapperElement[0]);
        }
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
}
