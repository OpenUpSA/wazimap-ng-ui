import {Component} from "../utils";

export class LockFilterButton extends Component {
    constructor(parent) {
        super(parent);

        this.prepareDomElements();

        this.isVisible = false;
    }

    get element() {
        return this._element;
    }

    set element(value) {
        this._element = value;
    }

    get isVisible() {
        return this._isVisible;
    }

    set isVisible(value) {
        if (value) {
            $(this._element).removeClass('hidden');
        } else {
            $(this._element).addClass('hidden');
        }

        this._isVisible = value;
    }

    prepareDomElements() {
        this.createButton();
    }

    createButton() {
        let button = document.createElement('a');

        let svgElement = document.createElement('svg');
        $(svgElement).attr('width', 18)
            .attr('height', 16)
            .attr('viewBox', '0 0 18 16')
            .attr('fill', 'none')
            .attr('xmlns', 'http://www.w3.org/2000/svg');

        let path = document.createElement('path');
        $(path).attr('d', 'M11 4.5C11 3.11875 12.1187 2 13.5 2C14.8813 2 16 3.11875 16 4.5V6C16 ' +
            '6.55312 16.4469 7 17 7C17.5531 7 18 6.55312 18 6V4.5C18 2.01562 15.9844 0 13.5 0C11.0156 0 9 2.01562 9 4.5V6H2C0.896875 6 0 6.89687 0' +
            ' 8V14C0 15.1031 0.896875 16 2 16H12C13.1031 16 14 15.1031 14 14V8C14 6.89687 13.1031 6 12 6H11V4.5Z')
            .attr('fill', '#707070');

        $(svgElement).append(path);

        let svgIcon = document.createElement('div');
        $(svgIcon).addClass('svg-icon')
            .append(svgElement);

        $(button)
            .attr('href', '#')
            .append(svgIcon)
            .addClass('lock-indicator-button');

        this._element = button;
    }
}