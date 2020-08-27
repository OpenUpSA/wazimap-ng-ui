import {Observable, checkIterate} from '../../utils';
import {API} from '../../api';
import {Category} from './category';

const activeClsName = 'active';
const hideondeployClsName = 'hideondeploy';
const categoryWrapperClsName = '.point-mapper__h2_wrapper';
const categorySourceClsName = '.point-mapper__h2_source .truncate';

export class Theme extends Observable {
    constructor(themeIndex, data, pointDataItem, categoryItem) {
        super()

        this.active = false;
        this.data = data;
        this.categories = [];
        this.pointDataItem = pointDataItem;
        this.categoryItem = categoryItem;
        this.themeIndex = themeIndex;

        this.prepareDomElements();
        this.createCategories();
    }

    prepareDomElements() {
        const self = this;
        this.element = this.pointDataItem.cloneNode(true);
        $(this.element).removeClass(hideondeployClsName);
        $(this.element).find('.point-mapper__h1_checkbox input[type=checkbox]').on('click', () => self.toggle());
        $('.point-data__h1_name .truncate', this.element).text(this.name);
        $('.point-mapper__h1_trigger', this.element).removeClass(activeClsName).addClass('theme-' + this.themeIndex);

        $(categoryWrapperClsName, this.element).html('');
    }

    createCategory(categoryDatum, isLast) {
        const category = new Category(this.themeIndex, categoryDatum, this.categoryItem, isLast);
        this.bubbleEvents(category, ['point_tray.category.selected', 'point_tray.category.unselected']);

        return category;
    }

    createCategories() {
        const self = this;
        checkIterate(this.data.categories, (categoryDatum, i) => {
            let isLast = i === (this.data.categories.length - 1);
            categoryDatum.theme = this.data;
            let category = self.createCategory(categoryDatum, isLast);
            this.categories.push(category);

            $(self.element).find(categoryWrapperClsName).append(category.element);
            $(categorySourceClsName, self.element).text(category.metadata.source);
        })
    }


    toggle() {
        if (this.active)
            this.toggleOff()
        else
            this.toggleOn()
    }

    toggleOff() {
        this.active = false;
        this.categories.forEach(category => {
            category.toggleOff();
        })
        this.highlight(false);
        this.triggerEvent("point_tray.theme.unselected", this);
    }

    toggleOn() {
        this.active = true;
        this.categories.forEach(category => {
            category.toggleOn();
        })

        this.highlight(true);
        this.triggerEvent("point_tray.theme.selected", this)
    }

    highlight(flag) {
        if (flag) {
            $('.point-mapper__h1_trigger', this.element).addClass(activeClsName);
        } else {
            $('.point-mapper__h1_trigger', this.element).removeClass(activeClsName);
        }

    }

    get name() {
        return this.data.name;
    }

    get id() {
        return this.data.id;
    }
}