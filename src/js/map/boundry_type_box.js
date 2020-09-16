import {Observable} from "../utils";

const selectElement = $('.map-geo-select')[0];

export class BoundryTypeBox extends Observable {
    constructor() {
        super();

        this.prepareDomElements();
        this.getChildrenTypes();
    }

    prepareDomElements = () => {
        $(selectElement).removeClass('hidden');
    }

    getChildrenTypes = () => {

    }
}