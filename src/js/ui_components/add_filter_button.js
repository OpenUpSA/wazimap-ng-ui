import {Component} from "../utils";

export class AddFilterButton extends Component {
    static EVENTS = {
        clicked: "addButton.clicked"
    }

    constructor(parent, elements) {
        super(parent);

        this._elements = elements;
        this._parent = parent;

        this.prepareDomElements();
        this.prepareEvents();
    }

    prepareDomElements() {
        this.button = $(this._parent.container).find(this._elements.addButton);
    }

    prepareEvents() {
        this.button.off('click').on('click', () => this.triggerEvent(AddFilterButton.EVENTS.clicked));
    }

    disable() {
        this.button.addClass('disabled');
    }

    enable() {
        this.button.removeClass('disabled');
    }

    show() {
        this.button.removeClass('is--hidden');
    }

    hide() {
        this.button.addClass('is--hidden');
    }
}