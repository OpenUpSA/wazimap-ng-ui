import {Component} from "../../utils";

export class AddFilterButton extends Component {
    static EVENTS = {
        clicked: "addButton.clicked"
    }

    constructor() {
        super();
        this.prepareDomElements();
        this.prepareEvents();
    }

    prepareDomElements() {
        this.button = $('a.mapping-options__add-filter');
    }

    prepareEvents() {
        this.button.on('click', () => this.triggerEvent(AddFilterButton.EVENTS.clicked));
    }

    disable() {
        this.button.addClass('disabled');
    }

    enable() {
        this.button.removeClass('disabled');
    }
}