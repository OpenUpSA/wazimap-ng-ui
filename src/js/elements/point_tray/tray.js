import {getJSON, numFmt, Observable, hasElements, ThemeStyle, checkIterate} from '../../utils';
import {Theme} from './theme';

const url = 'points/themes';

const categoryWrapperClsName = '.point-data__h1_content';
const treeLineClsName = '.point-data__h2_tree-line-v';
const wrapperClsName = '.point-data__content_wrapper';
const pointDataItemClsName = '.point-data__h1--dropdown';
const categoryItemClsName = '.point-data__h2_wrapper';
const stylesClsName = '.styles';

export class PointDataTray extends Observable {
    constructor(baseUrl, profileId) {
        super();
        this.baseUrl = baseUrl;
        this.profileId = profileId;

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

    createTheme(datum) {
        const theme = new Theme(datum, this.pointDataItem, this.categoryItem);
        theme.on("categorySelected", category => this.triggerEvent("categorySelected", category))
        theme.on("categoryUnselected", category => this.triggerEvent("categoryUnselected", category))
        theme.on("themeSelected", theme => this.triggerEvent("themeSelected", theme))
        theme.on("themeUnselected", theme => this.triggerEvent("themeUnselected", theme))

        return theme;
    }

    loadThemes() {
        const self = this;
        const themeUrl = `${this.baseUrl}/${url}/${this.profileId}/`;

        self.triggerEvent("loadingThemes", self);

        getJSON(themeUrl).then(data => {
            checkIterate(data.results, themeDatum => {
                let theme = self.createTheme(themeDatum);
                let item = theme.element;

                //append tree
                let treeItem = this.treeLineItem.cloneNode(true);
                $(categoryWrapperClsName, item).append(treeItem);

                //Replace with correct icon and color
                ThemeStyle.replaceChildDivWithThemeIcon(
                    themeDatum.id,
                    $(item).find('.point-data__h1_trigger'),
                    $(item).find('.point-data__h1_trigger-icon')
                );

                $(wrapperClsName).append(item);
                self.triggerEvent("loadedThemes", data);
            })

        })
    }
}