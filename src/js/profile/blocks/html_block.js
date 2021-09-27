import {ContentBlock} from './content_block';

const hamburgerClass = '.profile-indicator__options'
const filtersClass = '.profile-indicator__filters-wrapper';
const bodyClass = '.profile-indicator__chart_body';

export class HTMLBlock extends ContentBlock {
    constructor(parent, container, indicator, title, isLast) {
        super(parent, container, indicator, title, isLast)

        this.prepareDomElements();
    }

    get html() {
      return this.indicator.data.map(item => `<div>${item.contents}</div>`);
    }


    prepareDomElements() {
        super.prepareDomElements();

        $(filtersClass, this.container).remove();
        $(bodyClass, this.container).html(this.html);
        $(hamburgerClass, this.container).remove();
    }
}
