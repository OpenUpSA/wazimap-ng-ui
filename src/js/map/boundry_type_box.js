import {Observable} from "../utils";

const selectElement = $('.map-geo-select')[0];

export class BoundryTypeBox extends Observable {
    constructor() {
        super();

        this.prepareDomElements();
    }

    prepareDomElements = () => {
        $(selectElement).removeClass('hidden');
    }

    populateBoundryOptions = (children) => {
        let boundryTypes = [];
        for (const [boundryType] of Object.entries(children)) {
            boundryTypes.push(boundryType);
        }

        console.log({'boundryTypes' : boundryTypes})
    }
}