import {Component} from "../utils";
import {ConfirmationModal} from "../ui_components/confirmation_modal";

let selectElement = $('.map-geo-select')[0];
let selectedOption = null;
let optionWrapper = null;
let optionItem = null;

export class BoundaryTypeBox extends Component {
    constructor(parent, preferredChildren) {
        super(parent);

        this.preferredChildren = preferredChildren;
        this.confirmationModal = new ConfirmationModal(this, ConfirmationModal.COOKIE_NAMES.BOUNDARY_TYPE_SELECTION);
        this._activeVersion = null;
    }

    get activeVersion() {
        return this._activeVersion;
    }

    set activeVersion(value) {
        this._activeVersion = value;
    }

    activeVersionUpdated = (activeVersion) => {
        this.activeVersion = activeVersion;

        let text = $(selectedOption).find('.dropdown-menu__selected-item .truncate').text();
        let arr = text.split('/');
        let childType = arr[1].trim();

        this.setSelectedOption(`${activeVersion.model.name} / ${childType}`);
    }

    setVisibilityOfDropdown = (boundaryTypes) => {
        if (boundaryTypes.length <= 1) {
            $(selectElement).addClass('hidden');
        } else {
            $(selectElement).removeClass('hidden');
        }
    }

    populateBoundaryOptions = (children, currentLevel, versions) => {
        if (typeof this.preferredChildren === 'undefined') {
            return;
        }

        let boundaryTypes = Object.keys(children);
        let options = this.getOptions(boundaryTypes, versions);

        if (typeof this.preferredChildren[currentLevel] !== 'undefined') {
            const availableLevels = this.preferredChildren[currentLevel].filter(level => children[level] !== undefined)

            this.setElements();
            this.setSelectedOption(`${this.activeVersion.model.name} / ${availableLevels[0]}`);
            this.populateOptions(options, currentLevel);
        }
    }

    getOptions = (boundaryTypes, versions) => {
        let options = [];
        versions.forEach((v) => {
            boundaryTypes.forEach((bt) => {
                options.push(`${v.model.name} / ${bt}`);
            })
        })

        return options;
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
                this.confirmationModal.askForConfirmation()
                    .then((payload) => {
                        if (payload.confirmed) {
                            this.boundaryTypeSelected(bt, currentLevel);
                        }
                    })
            });

            $(optionWrapper).append(item);
        })

        this.setVisibilityOfDropdown(boundaryTypes);
    }

    boundaryTypeSelected = (type, currentLevel) => {
        this.setSelectedOption(type);

        let arr = type.split('/');

        let payload = {
            selected_version_name: arr[0].trim(),
            selected_type: arr[1].trim(),
            current_level: currentLevel
        }
        this.triggerEvent("boundary_types.option.selected", payload);
    }
}
