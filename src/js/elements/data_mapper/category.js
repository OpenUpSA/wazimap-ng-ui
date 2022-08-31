import {Component} from "../../utils";

export class Category extends Component {
    constructor(parent, text, detail) {
        super(parent);

        this._element = $('.styles .data-category--v2')[0].cloneNode(true);
        this._detail = detail;
        this._wrapper = $('.data-mapper-content__list');

        this.text = text;   //set the html too
        this.isExpanded = false;

        this.prepareDomElements();
        this.addElementToWrapper();
    }

    get element() {
        return this._element;
    }

    get text() {
        return this._text;
    }

    set text(value) {
        this._text = value;
        $('.data-category__h1_title div', this.element).text(value);
    }

    get detail() {
        return this._detail;
    }

    get wrapper() {
        return this._wrapper;
    }

    get isExpanded() {
        return this._isExpanded;
    }

    set isExpanded(value) {
        if (value) {
            $(this.element).find('.data-category__h1_content--v2').removeClass('is--closed');
        } else {
            $(this.element).find('.data-category__h1_content--v2').addClass('is--closed');
        }

        this._isExpanded = value;
    }

    prepareDomElements() {
        $(this.element).find('.data-category__h1_trigger--v2').on('click', () => {
            this.isExpanded = !this.isExpanded;
        })

        $(".data-category__h2", this.element).remove();
    }

    addElementToWrapper() {
        this.wrapper.append($(this.element));
    }
}