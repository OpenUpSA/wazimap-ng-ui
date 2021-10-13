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
        let childType = arr.length > 1 ? arr[1].trim() : '';
        const selectedText = arr.length > 1 ? `${activeVersion.model.name} / ${childType}` : activeVersion.model.name;

        this.setSelectedOption(selectedText);
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
        let existingVersions = [...versions].filter((v) => {
            return v.exists
        });

        let boundaryTypes = Object.keys(children);
        let options = this.getOptions(boundaryTypes, existingVersions);

        if (typeof this.preferredChildren[currentLevel] !== 'undefined' || (boundaryTypes.length === 0 && existingVersions.length > 0)) {
            //(boundaryTypes.length === 0 && existingVersions.length > 0) -> there are no children but there are multiple versions
            const availableLevels = this.preferredChildren[currentLevel] !== undefined ? this.preferredChildren[currentLevel].filter(level => children[level] !== undefined) : [];
            const selectedOption = availableLevels.length > 0 ? `${this.activeVersion.model.name} / ${availableLevels[0]}` : this.activeVersion.model.name;

            this.setElements();
            this.setSelectedOption(selectedOption);
            this.populateOptions(options, currentLevel);
        }
    }

    getOptions = (boundaryTypes, versions) => {
        let options = [];
        const boundaryTypeCounts = boundaryTypes.length;

        versions.forEach((v) => {
            if (boundaryTypeCounts > 0) {
                boundaryTypes.forEach((bt) => {
                    options.push(`${v.model.name} / ${bt}`);
                })
            } else {
                options.push(v.model.name);
            }
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
            selected_type: arr.length > 1 ? arr[1].trim() : null,   //null = no children geo
            current_level: currentLevel
        }
        this.triggerEvent("boundary_types.option.selected", payload);
    }
}
