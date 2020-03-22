import {Observable} from '../../utils';

const categoryItemClsName = '.point-data__h2_wrapper';
const defaultActiveClsName = 'active-1';
const categoryItemDoneClsName = '.point-data__h2_load-complete';
const categoryItemLoadingClsName = '.point-data__h2_loading';

export class Category extends Observable {
    constructor(data) {
        super()

        this.active = false;
        this.data = data;
        this.prepareDomElements();

    }

    prepareDomElements() {

        this.activeClassName = 'active-' + this.theme.id;
        this.categoryItem = $(categoryItemClsName)[0].cloneNode(true);
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
        this.triggerEvent("categoryUnselected", this);
        $(this.element).find('.point-data__h2').removeClass(this.activeClassName);
        this.showLoading(false);
        this.showDone(false);
    }

    toggleOn() {
        this.active = true;
        this.triggerEvent("categorySelected", this)
        $(this.element).find('.point-data__h2').addClass(this.activeClassName);
        this.showLoading(true);
        this.showDone(false);
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
        console.log(this.data);
        return this.data.theme;
    }
}