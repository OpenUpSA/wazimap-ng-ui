import {Component} from "../../utils";

export class SubCategory extends Component {
    constructor(parent, text, detail, dataMapperMenu) {
        super(parent);

        this._element = $('.styles .data-category__h2')[1].cloneNode(true);  //[0] -> v1  ---  [1] -> v2
        this._wrapper = $(this.parent.element).find('.data-category__h1_wrapper');
        this._detail = detail;
        this.dataMapperMenu = dataMapperMenu;

        this.text = text;   //set the html too
        this.isExpanded = false;

        this.prepareDomElements();
        this.addElementToWrapper();
    }

    get element() {
        return this._element;
    }

    get detail() {
        return this._detail;
    }

    get text() {
        return this._text;
    }

    set text(value) {
        this._text = value;
        $('.data-category__h2_trigger--v2 div.truncate', this.element).text(value);
    }

    get wrapper() {
        return this._wrapper;
    }

    get subIndicatorCount() {
        let count = 0;
        const indicators = Object.values(this.detail.indicators);
        if (indicators.length > 0) {
            for (const idx in indicators) {
                let indicator = indicators[idx];
                let primaryGroup = indicator.metadata.groups.filter(x => {
                    return x.name === indicator.metadata.primary_group
                })[0]
                count += primaryGroup.subindicators.length;
            }
        }

        return count;
    }

    get isExpanded() {
        return this._isExpanded;
    }

    set isExpanded(value) {
        if (value) {
            $(this.element).find('.data-category__h2_content--v2').removeClass('is--closed');

            this.dataMapperMenu.triggerEvent('data_mapper_menu.subcategory.expanded', this);
        } else {
            $(this.element).find('.data-category__h2_content--v2').addClass('is--closed');
        }

        this._isExpanded = value;
    }

    prepareDomElements() {
        $(this.element).find('.data-category__h2_trigger--v2').on('click', () => {
            this.isExpanded = !this.isExpanded;
        })

        $(".data-category__h3", this.element).remove();
    }

    addElementToWrapper() {
        $(this.wrapper).append($(this.element));
    }
}