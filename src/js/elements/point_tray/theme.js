import {Observable, checkIterate} from '../../utils';
import {Category} from './category';

const defaultActiveClsName = 'active-1';
const hideondeployClsName = 'hideondeploy';
const categoryWrapperClsName = '.point-data__h1_content';

export class Theme extends Observable {
    constructor(data, pointDataItem, categoryItem) {
        super()

        this.active = false;
        this.data = data;
        this.categories = [];
        this.pointDataItem = pointDataItem;
        this.categoryItem = categoryItem;

        this.prepareDomElements();
        this.createCategories();
    }

    prepareDomElements() {
        const self = this;
        this.element = this.pointDataItem.cloneNode(true);
        $(this.element).removeClass(hideondeployClsName);
        $(this.element).find('.point-data__h1_checkbox input[type=checkbox]').on('click', () => self.toggle());
        $('.h1__trigger_title .truncate', this.element).text(this.name);
        $('.point-data__h1_trigger', this.element).removeClass(defaultActiveClsName);

        $(categoryWrapperClsName, this.element).html('');
    }

    createCategory(categoryDatum, isLast) {
        const category = new Category(categoryDatum, this.categoryItem, isLast);
        category.on("categorySelected", category => this.triggerEvent("categorySelected", category))
        category.on("categoryUnselected", category => this.triggerEvent("categoryUnselected", category))

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
        this.triggerEvent("themeUnselected", this);
    }

    toggleOn() {
        this.active = true;
        this.categories.forEach(category => {
            category.toggleOn();
        })

        this.highlight(true);
        this.triggerEvent("themeSelected", this)
    }

    highlight(flag) {
        let activeClassName = 'active-' + this.id;
        if (flag) {
            $('.point-data__h1_trigger', this.element).addClass(activeClassName);
        } else {
            $('.point-data__h1_trigger', this.element).removeClass(activeClassName);
        }

    }

    get name() {
        return this.data.name;
    }

    get id() {
        return this.data.id;
    }
}