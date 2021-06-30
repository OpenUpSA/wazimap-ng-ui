import {ContentBlock} from "./content_block";

export class HTMLBlock extends ContentBlock {
    constructor(parent, container, title, html, isLast) {
        super(parent, title, isLast)

        this._container = container;
        this._html = html;

        this.prepareDomElements();
    }

    get container() {
        return this._container;
    }

    get html() {
        return this._html;
    }

    prepareDomElements() {
        $(this.container).html(this.html);
    }
}