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
        if (boundaryTypes.length > 0) {
            $(selectElement).removeClass('hidden');
        } else {
          $(selectElement).removeClass('hidden');
        }
    }

    populateBoundaryOptions = (childBoundaries, currentLevel, versions) => {

        if (typeof this.preferredChildren === 'undefined') {
            return;
        }
        let existingVersions = [...versions].filter((v) => {
            return v.exists
        });

        let boundaryTypes = this.getBoundaryTypes(childBoundaries);
        let activeVersionBoundaries = boundaryTypes[this.activeVersion.model.name] || [];
        let options = this.getOptions(boundaryTypes, existingVersions);

    }

    getAvailableLevelsForVersion = (currentLevel, boundaryTypes) => {
      let availableLevels = [];
      let activeVersionBoundaries = boundaryTypes[this.activeVersion.model.name] || [];
      if (this.preferredChildren[currentLevel] !== undefined && activeVersionBoundaries.length > 0){
        this.preferredChildren[currentLevel].filter(
          level => activeVersionBoundaries.includes(level)
        )
      }
      return availableLevels;
    }

    getBoundaryTypes = (boundariesByVerision) => {
      let options = {};
      Object.keys(boundariesByVerision).forEach((version) => {
        let children = Object.keys(boundariesByVerision[version].children);
        if (children.length > 0){
          options[version] = children;
        }
      });
      return options;
    }

    getOptions = (boundaryTypes, versions) => {
        let options = [];
        versions.forEach((v) => {
            const boundaries = boundaryTypes[v.model.name] || [];
            if (boundaries.length > 0) {
                boundaries.forEach((bt) => {
                    options.push(`${v.model.name} / ${bt}`);
                })
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
