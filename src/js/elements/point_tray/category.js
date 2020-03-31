import {Observable} from '../../utils';

const defaultActiveClsName = 'active-1';
const categoryItemDoneClsName = '.point-data__h2_load-complete';
const categoryItemLoadingClsName = '.point-data__h2_loading';

export class Category extends Observable {
    constructor(data, categoryItem) {
        super()

        this.active = false;
        this.data = data;
        this.categoryItem = categoryItem;
        this.prepareDomElements();
    }

    prepareDomElements() {
        this.activeClassName = 'active-' + this.theme.id;
        this.element = this.categoryItem.cloneNode(true);

        $(this.element).on('click', () => this.toggle())
        $(this.element).find(categoryItemLoadingClsName).addClass('hide');
        this.showLoading(false);
        this.showDone(false);
        $(this.element).find('.point-data__h2').removeClass(defaultActiveClsName);

        $('.truncate', this.element).text(this.name);
        $('.point-data__h2_link', this.element).removeClass('point-data__h2_link').addClass('point-data__h2_link--disabled');
    }


    toggle() {
        if (this.active)
            this.toggleOff()
        else
            this.toggleOn()
    }

    toggleOff() {
        this.active = false;
        this.highlight(false);
        this.showLoading(false);
        this.showDone(false);
        this.triggerEvent("categoryUnselected", this);
    }

    toggleOn() {
        this.active = true;
        this.highlight(true);
        this.showLoading(true);
        this.showDone(false);
        this.triggerEvent("categorySelected", this)
    }

    highlight(flag) {
        if (flag)
            $(this.element).find('.point-data__h2').addClass(this.activeClassName);
        else
            $(this.element).find('.point-data__h2').removeClass(this.activeClassName);
    }

    showLoading(flag) {
        if (flag)
            $(this.element).find(categoryItemLoadingClsName).removeClass('hide');
        else
            $(this.element).find(categoryItemLoadingClsName).addClass('hide');
    }

    showDone(flag) {
        if (flag)
            $(this.element).find(categoryItemDoneClsName).removeClass('hide');
        else
            $(this.element).find(categoryItemDoneClsName).addClass('hide');
    }


    get name() {
        return this.data.name;
    }

    get id() {
        return this.data.id;
    }

    get theme() {
        return this.data.theme;
    }
}
