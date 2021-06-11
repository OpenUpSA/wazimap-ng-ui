import { Observable } from "../../utils";

export class AddFilterButton extends Observable {
    constructor() {
        super();
        this.prepareDomElements();
        this.prepareEvents();
    }

    prepareDomElements() {
        this.button = $('a.mapping-options__add-filter');
    }

    prepareEvents() {
        this.button.on('click', () => this.triggerEvent('mapchip.filters.addButton.clicked'));
    }

    disable() {
        this.button.addClass('disabled');
    }

    enable() {
        this.button.removeClass('disabled');
    }
}