import {numFmt, Component, hasElements, ThemeStyle, checkIterate} from '../../utils';
import {Theme} from './theme_to_be_removed';
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

    categoryToggled(category) {
        console.log({'tray.js category': category})
        this.triggerEvent("point_tray.category.selected", category)
    }

    loadThemes() {
        const self = this;
        self.triggerEvent("point_tray.tray.loading_themes", self);

        self.api.loadThemes(this.profileId).then(data => {
            this.pointMapperRoot.render(
                <PointMapperTreeview
                    themes={data}
                    categoryToggled={(category) => self.categoryToggled(category)}
                />
            );
            self.triggerEvent("point_tray.tray.themes_loaded", data);
            $(loadingClsName).addClass('hidden');
        })
    }

    loadThemesOld() {
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
