import {Observable, checkIterate} from '../../utils';
import {Category} from './category';

const defaultActiveClsName = 'active-1';
const pointDataItemClsName = '.point-data__h1--dropdown';
const hideondeployClsName = 'hideondeploy';
const categoryWrapperClsName = '.point-data__h1_content';
const categoryItemClsName = '.point-data__h2_wrapper';

export class Theme extends Observable {
    constructor(data) {
        super()

        this.active = false;
        this.data = data;
        this.categories = [];

        this.prepareDomElements();
        this.createCategories();
    }

    prepareDomElements() {
        const self = this;
        this.pointDataItem = $(pointDataItemClsName)[0].cloneNode(true);
        this.element = this.pointDataItem.cloneNode(true);
        $(this.element).removeClass(hideondeployClsName);
        $(this.element).find('.point-data__h1_checkbox input[type=checkbox]').on('click', () => self.toggle());
        $('.h1__trigger_title .truncate', this.element).text(this.name);
        $('.point-data__h1_trigger', this.element).removeClass(defaultActiveClsName);
        $(categoryWrapperClsName, this.element).html('');

    }

    createCategory(categoryDatum) {
        const category = new Category(categoryDatum);
        category.on("categorySelected", category => this.triggerEvent("categorySelected", category))
        category.on("categoryUnselected", category => this.triggerEvent("categoryUnselected", category))
        return category;
    }

    createCategories() {
        const self = this;
        checkIterate(this.data.categories, categoryDatum => {
            categoryDatum.theme = this.data;
            let category = self.createCategory(categoryDatum);
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
        $(this.element).find('.point-data__h2').removeClass(this.activeClassName);
        this.triggerEvent("categoryUnselected", this);
    }

    toggleOn() {
        const self = this;
        let activeClassName = 'active-' + this.id;
        this.categories.forEach(category => {
            category.toggleOn();
        })

         $(this.element).find(categoryItemClsName).each(function () {
            if (!$(this).find('.point-data__h2').hasClass(activeClassName)) {
                $(this).find('.point-data__h2').addClass(activeClassName);
            }
        })

        $('.point-data__h1_trigger', this.element).addClass(activeClassName);
        this.triggerEvent("themeSelected", this)
    }

    get name() {
        return this.data.name;
    }

    get id() {
        return this.data.id;
    }
}
