import {numFmt, Component, hasElements, ThemeStyle, checkIterate} from '../../utils';
import {Theme} from './theme';
import {createRoot} from "react-dom/client";
import Watermark from "../../ui_components/watermark";
import React from "react";

const categoryWrapperClsName = '.point-mapper__h1_content';
const treeLineClsName = '.point-data__h2_line-v';
const wrapperClsName = '.point-mapper-content__list';
const pointDataItemClsName = '.point-mapper__h1';
const categoryItemClsName = '.point-mapper__h2'; //'.point-mapper__h2_wrapper';
const stylesClsName = '.styles';
const loadingClsName = '.point-mapper-content__loading';

export class PointDataTray extends Component {
    constructor(parent, api, profileId) {
        super(parent);
        this.api = api;
        this.profileId = profileId;
        this.themes = [];

        this.prepareDomElements();
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

    loadThemes() {
        const self = this;
        let themeIndex = 0;

        self.triggerEvent("point_tray.tray.loading_themes", self);

        self.api.loadThemes(this.profileId).then(data => {
            checkIterate(data, themeDatum => {
                themeIndex++;
                let theme = self.createTheme(themeIndex, themeDatum);
                this.themes.push(theme);
                let item = theme.element;

                //append tree
                let treeItem = this.treeLineItem.cloneNode(true);
                $(categoryWrapperClsName, item).append(treeItem);

                ThemeStyle.replaceChildDivWithIcon($(item).find('.point-data__h1_icon'), themeDatum.icon)

                $(loadingClsName).addClass('hidden');
                $(wrapperClsName).append(item);
            })
            self.triggerEvent("point_tray.tray.themes_loaded", data);
        })

        this.addWatermark();
    }

    addWatermark() {
        const paddingSpace = 110;
        const watermarkHeight = 60;
        const descriptionHeight = 60;
        const headerHeight = 35;
        const windowHeight = window.innerHeight;

        const wrapperMinHeight = windowHeight - (headerHeight + descriptionHeight + paddingSpace + watermarkHeight);
        $('.point-mapper-content__list').css('min-height', wrapperMinHeight);

        if ($('.point-mapper .watermark-wrapper').length > 0) {
            return;
        }

        let watermarkWrapper = document.createElement('div');
        $(watermarkWrapper).addClass('watermark-wrapper');
        $('.point-mapper-content')
            .css('padding-bottom', 0)
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
