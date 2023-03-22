import {Component} from "../utils";
import loading from "../../images/loading.gif";

export class GlobalLoading extends Component {
    constructor(parent, message) {
        super(parent);

        this._isVisible = false
        this._message = message;

        this.prepareDomElements();
    }

    get message() {
        return this._message;
    }

    set message(value) {
        this._message = value;

        this.element.find('.modal-message').text(value);
    }

    get element() {
        return $(this._element);
    }

    get isVisible() {
        return this._isVisible;
    }

    set isVisible(value) {
        this._isVisible = value;

        if (value) {
            this.element.removeClass('hidden');
        } else {
            this.element.addClass('hidden');
        }
    }

    prepareDomElements() {
        const className = 'global-loading-modal';
        const elementExists = $(`.${className}`).length > 0;
        if (elementExists) {
            this._element = $(`.${className}`);
            return;
        }

        this._element = $('.warning-modal')[0].cloneNode(true);

        this.element.addClass(className);
        this.element.find('.warning__header').remove();
        this.element.find('.warning__actions').remove();
        this.element.find('.warning__content .w-richtext').remove();
        this.element.find('.warning').css('width', 'unset');
        this.element.css('z-index', '9999')
            .css('position', 'fixed');

        const loadingImg = document.createElement('img');
        loadingImg.src = loading;
        loadingImg.height = 40;
        this.element.find('.warning__content').append(loadingImg);

        const text = document.createElement('span');
        text.innerText = this.message;
        $(text).css('font-weight', 'bold');
        $(text).css('font-size', '18px');
        $(text).css('margin-left', '15px');
        $(text).css('line-height', '40px');
        $(text).addClass('modal-message');
        this.element.find('.warning__content').append(text);

        document.body.appendChild(this._element);
    }
}