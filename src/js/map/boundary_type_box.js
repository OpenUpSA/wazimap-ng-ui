import {Observable} from "../utils";

let selectElement = $('.map-geo-select')[0];
let selectedOption = null;
let optionWrapper = null;
let optionItem = null;

export class BoundaryTypeBox extends Observable {
    constructor(preferred_children) {
        super();

        this.preferred_children = preferred_children;
    }

    setVisibilityOfDropdown = (boundaryTypes) => {
        if (boundaryTypes.length <= 1) {
            $(selectElement).addClass('hidden');
        } else {
            $(selectElement).removeClass('hidden');
        }
    }

    populateBoundaryOptions = (children, currentLevel) => {
        if (typeof this.preferred_children === 'undefined'){
            return;
        }

        let boundaryTypes = [];
        for (const [boundaryType] of Object.entries(children)) {
            boundaryTypes.push(boundaryType);
        }

        const availableLevels = this.preferred_children[currentLevel].filter(level => children[level] != undefined)

        this.setElements();
        this.setSelectedOption(availableLevels[0]);
        this.populateOptions(boundaryTypes, currentLevel);
    }

    setElements = () => {
        selectedOption = $(selectElement).find('.dropdown-menu__trigger')
        optionWrapper = $(selectElement).find('.dropdown-menu__content');
        optionItem = $(selectElement).find('.dropdown__list_item')[0].cloneNode(true);

        $(optionWrapper).empty();
    }

    setSelectedOption = (selectedText) => {
        $(selectedOption).find('.dropdown-menu__selected-item .truncate').text(selectedText);
    }

    populateOptions = (boundaryTypes, currentLevel) => {
        boundaryTypes.forEach((bt) => {
            let item = optionItem.cloneNode(true);
            $(item).removeClass('selected');
            $('.truncate', item).text(bt);
            $(item).on('click', () => {
                this.boundaryTypeSelected(bt, currentLevel);
            });

            $(optionWrapper).append(item);
        })

        this.setVisibilityOfDropdown(boundaryTypes);
    }

    boundaryTypeSelected = (type, currentLevel) => {
        this.setSelectedOption(type);

        let payload = {
            selected_type: type,
            current_level: currentLevel
        }
        this.triggerEvent("boundary_types.option.selected", payload);
    }
}