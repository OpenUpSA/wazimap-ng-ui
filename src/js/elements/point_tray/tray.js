import {numFmt, Component, hasElements, ThemeStyle, checkIterate} from '../../utils';
import {createRoot} from "react-dom/client";
import Watermark from "../../ui_components/watermark";
import React from "react";
import PointMapperTreeview from "./point_mapper_treeview";

const categoryWrapperClsName = '.point-mapper__h1_content';
const treeLineClsName = '.point-data__h2_line-v';
const wrapperClsName = '.point-mapper-content__list';
const pointDataItemClsName = '.point-mapper__h1';
const categoryItemClsName = '.point-mapper__h2'; //'.point-mapper__h2_wrapper';
const stylesClsName = '.styles';
const loadingClsName = '.point-mapper-content__loading';

export class PointDataTray extends Component {
    constructor(parent, api, profileId, watermarkEnabled) {
        super(parent);
        this.api = api;
        this.profileId = profileId;
        this.themes = [];

        this.prepareDomElements();

        if (watermarkEnabled) {
            this.addWatermark();
        }
        this.addTreeviewRoot();
    }

    prepareDomElements() {
        this.treeLineItem = $(treeLineClsName)[0].cloneNode(true);
        this.pointDataItem = $(pointDataItemClsName)[0].cloneNode(true);
        this.categoryItem = $(categoryItemClsName)[0].cloneNode(true);

        this.clearText();
    }

    clearText() {
        $(wrapperClsName).html('');
        $(stylesClsName).find(wrapperClsName).remove(); //need to remove the cloned objects, or js keeps styling the wrong element
    }

    createTheme(themeIndex, datum) {
        const theme = new Theme(this, themeIndex, datum, this.pointDataItem, this.categoryItem);

        this.bubbleEvents(theme, [
            'point_tray.category.selected', 'point_tray.category.unselected',
            'point_tray.theme.selected', 'point_tray.them.unselected'
        ])

        return theme;
    }

    addTreeviewRoot() {
        let pointMapperElement = document.getElementsByClassName("point-mapper-content__list");
        if (pointMapperElement.length > 0) {
            this.pointMapperRoot = createRoot(pointMapperElement[0]);
        }
    }

    triggerCategoryLoaded(category) {
        this.triggerEvent("point_data.category.loaded", category);
    }

    triggerCategoryLoading(category) {
        this.triggerEvent("point_data.category.loading", category);
    }

    categoryToggled(category) {
        if (category.isLoading){
            return;
        }

        if (category.isSelected) {
            // unselected
            this.triggerEvent("point_tray.category.unselected", category)
        } else {
            // selected
            this.triggerEvent("point_tray.category.selected", category);
        }
    }

    themeToggled(theme, isChecked) {
        if (isChecked) {
            // select all categories
            theme.categories.forEach(category => {
                if (category.isSelected !== true && category.isLoading !== true) {
                    // false or undefined
                    this.triggerEvent("point_tray.category.selected", category);
                }
            })
        } else {
            // unselect all categories
            theme.categories.forEach(category => {
                if (category.isSelected) {
                    this.triggerEvent("point_tray.category.unselected", category);
                }
            })
        }
    }

    loadThemes() {
        const self = this;
        self.triggerEvent("point_tray.tray.loading_themes", self);

        self.api.loadThemes(this.profileId).then(data => {
            this.pointMapperRoot.render(
                <PointMapperTreeview
                    themes={data}
                    categoryToggled={(category) => self.categoryToggled(category)}
                    themeToggled={(theme, isChecked) => self.themeToggled(theme, isChecked)}
                    parent={this}
                />
            );
            self.triggerEvent("point_tray.tray.themes_loaded", data);
            $(loadingClsName).addClass('hidden');
        })
    }

    addWatermark() {
        if ($('.point-mapper .watermark-wrapper').length > 0) {
            return;
        }

        let watermarkWrapper = document.createElement('div');
        $(watermarkWrapper)
            .addClass('watermark-wrapper');
        $('.point-mapper-content')
            .append(watermarkWrapper);

        let watermarkRoot = createRoot(watermarkWrapper);
        watermarkRoot.render(<Watermark/>);
    }

    unSelectAll() {
        checkIterate(this.themes, (theme) => {
            checkIterate(theme.categories, (category) => {
                if (category.active) {
                    $(category.element).trigger('click');
                }
            })

            if (theme.active) {
                $(theme.element).find('.point-mapper__h1_checkbox input[type=checkbox]').trigger('click');
            }
        })
    }
}
