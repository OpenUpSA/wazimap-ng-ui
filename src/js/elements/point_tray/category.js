import {Component} from '../../utils';

let activeClsName = 'active';
const categoryItemDoneClsName = '.point-mapper__h2_load-complete';
const categoryItemLoadingClsName = '.point-mapper__h2_loading';

export class Category extends Component {
    constructor(parent, themeIndex, data, categoryItem, isLast) {
        super(parent)

        this.active = false;
        this.data = this.fixData(data);
        this.categoryItem = categoryItem;
        this.isLast = isLast;
        this.themeIndex = themeIndex;
        this.prepareDomElements();
    }

    fixData(data) {
        data = {...data}

        if (data.metadata == undefined)
            data.metadata = {}

        if (data.metadata.source == undefined)
            data.metadata.source = ""

        return data

    }

    prepareDomElements() {
        this.activeClassName = activeClsName;
        this.element = this.categoryItem.cloneNode(true);

        $(this.element).on('click', () => this.toggle())
        $(this.element).find(categoryItemLoadingClsName).addClass('hidden');
        this.showLoading(false);
        this.showDone(false);
        $(this.element).removeClass(activeClsName);
        if (this.isLast) {
            $(this.element).addClass('last');
        }

        $(this.element).removeClass('theme-1').addClass('theme-' + this.themeIndex);
        $(this.element).attr('data-id', this.data.id);
        $(this.element).attr('data-themeIndex', this.themeIndex);

        $('.point-mapper__h2_name .truncate', this.element).text(this.name);
        $('.point-data__label_source .truncate', this.element).text(this.data.metadata.source);
        $('.point-data__label_source .truncate', this.element).attr('title', this.data.metadata.source);
        $('.point-data__h2_link', this.element).removeClass('point-data__h2_link').addClass('point-data__h2_link--disabled');
    }

    get metadata() {
        if (this.data.metadata == undefined) {
            return {
                source: '',
                description: '',
                licence: {
                    name: '',
                    url: null
                }
            }
        } else {
            return this.data.metadata;
        }
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
        this.triggerEvent("point_tray.category.unselected", this);
    }

    toggleOn() {
        this.active = true;
        this.highlight(true);
        this.showLoading(true);
        this.showDone(false);
        this.triggerEvent("point_tray.category.selected", this)
    }

    highlight(flag) {
        if (flag)
            $(this.element).addClass(this.activeClassName);
        else
            $(this.element).removeClass(this.activeClassName);
    }

    showLoading(flag) {
        if (flag)
            $(this.element).find(categoryItemLoadingClsName).removeClass('hidden');
        else
            $(this.element).find(categoryItemLoadingClsName).addClass('hidden');
    }

    showDone(flag) {
        if (flag)
            $(this.element).find(categoryItemDoneClsName).removeClass('hidden');
        else
            $(this.element).find(categoryItemDoneClsName).addClass('hidden');
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
