import {Component} from "../utils";
import {ConfirmationModal} from "../ui_components/confirmation_modal";

let selectedOption = null;
let optionWrapper = null;
let optionItem = null;

export class BoundaryTypeBox extends Component {
    constructor(parent, preferredChildren) {
        super(parent);

        this.selectElement = $('.map-geo-select')[0];

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

    activeVersionUpdated = (geometries, activeVersion, selectedGeoType) => {
        this.activeVersion = activeVersion;
        let levels = Object.keys(geometries.children) || [];

        if (levels.length > 0) {
            const selectedText = `${activeVersion.model.name} / ${levels.includes(selectedGeoType) ? selectedGeoType : levels[0]}`;
            this.setSelectedOption(selectedText);
        }
    }

    setVisibilityOfDropdown = (versionOptions) => {
        if (versionOptions.length === 0) {
            $(this.selectElement).addClass('hidden');
        } else if (versionOptions.length === 1) {
            $(this.selectElement).find(".dropdown-menu").css('pointer-events', 'none');
            $(this.selectElement).find(".dropdown-menu__icon").addClass("hidden");
        } else {
            $(this.selectElement).removeClass('hidden');
            $(this.selectElement).find(".dropdown-menu").css('pointer-events', 'auto');
            $(this.selectElement).find(".dropdown-menu__icon").removeClass("hidden");
        }
    }

    populateBoundaryOptions = (versionGeometries, currentLevel, versions) => {
        if (typeof this.preferredChildren === 'undefined') {
            return;
        }
        let existingVersions = [...versions].filter((v) => {
            return v.model.exists
        });

        let boundaryTypes = this.getBoundaryLevelsByVersion(versionGeometries);
        let options = this.getOptions(boundaryTypes, existingVersions);
        let currentVersionLevels = boundaryTypes[this.activeVersion.model.name] || [];
        if (typeof this.preferredChildren[currentLevel] !== 'undefined' || (currentVersionLevels.length === 0 && existingVersions.length > 0)) {
            //(currentVersionLevels.length === 0 && existingVersions.length > 0) -> there are no children but there are multiple versions
            const availableLevels = this.preferredChildren[currentLevel] !== undefined ? this.preferredChildren[currentLevel].filter(level => currentVersionLevels.includes(level)) : [];
            const selectedOption = availableLevels.length > 0 ? `${this.activeVersion.model.name} / ${availableLevels[0]}` : this.activeVersion.model.name;
            this.setElements();
            this.setSelectedOption(selectedOption);
            this.populateOptions(options, currentLevel);
        }
    }

    getBoundaryLevelsByVersion = (versionGeometries) => {
        let options = {};
        Object.keys(versionGeometries).forEach((version) => {
            let children = Object.keys(versionGeometries[version].children);
            if (children.length > 0) {
                options[version] = children;
            }
        });
        return options;
    }

    getOptions = (boundaryTypes, versions) => {
        let options = [];
        versions.forEach((v) => {
            let versionLevels = boundaryTypes[v.model.name] || [];
            if (versionLevels.length > 0) {
                versionLevels.forEach((level) => {
                    options.push(`${v.model.name} / ${level}`);
                })
            } else {
                options.push(v.model.name);
            }
        })
        return options;
    }

    setElements = () => {
        selectedOption = $(this.selectElement).find('.dropdown-menu__trigger');
        optionWrapper = $(this.selectElement).find('.dropdown-menu__content');
        let optionItems = $(this.selectElement).find('.dropdown__list_item');
        if (optionItems.length === 0) {
            let listItem = document.createElement('div');
            $(listItem).addClass("dropdown__list_item");
            let childlistItem = document.createElement('div');
            $(childlistItem).addClass("truncate");
            $(listItem).append(childlistItem);
            optionItem = listItem;
        } else {
            optionItem = optionItems[0].cloneNode(true);
        }
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
