import {Component} from "../utils";

let selectElement = $('.map-geo-select')[0];
let selectedOption = null;
let optionWrapper = null;
let optionItem = null;
let BOUNDARY_MODAL_COOKIE_NAME = 'boundary_selection';

export class BoundaryTypeBox extends Component {
    constructor(parent, preferredChildren) {
        super(parent);

        this.preferredChildren = preferredChildren;

        this.prepareDomElements();
    }

    prepareDomElements = () => {
        $('.warning-modal .button-wrapper a').click(() => {
            $('.warning-modal').addClass('hidden');
        });
    }

    setVisibilityOfDropdown = (boundaryTypes) => {
        if (boundaryTypes.length <= 1) {
            $(selectElement).addClass('hidden');
        } else {
            $(selectElement).removeClass('hidden');
        }
    }

    populateBoundaryOptions = (children, currentLevel) => {
        if (typeof this.preferredChildren === 'undefined') {
            return;
        }

        let boundaryTypes = Object.keys(children);

        if (typeof this.preferredChildren[currentLevel] !== 'undefined') {
            const availableLevels = this.preferredChildren[currentLevel].filter(level => children[level] != undefined)

            this.setElements();
            this.setSelectedOption(availableLevels[0]);
            this.populateOptions(boundaryTypes, currentLevel);
        }
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
                this.askForConfirmation()
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

    askForConfirmation = () => {
        let alreadyConfirmed = this.checkIfAlreadyConfirmed();
        let payload = {
            confirmed: false
        }

        if (alreadyConfirmed) {
            return new Promise(function (resolve) {
                payload.confirmed = true;
                resolve(payload);
            })
        } else {
            let rememberChoice = this.rememberChoice;
            $('.warning-modal').removeClass('hidden');

            return new Promise(function (resolve) {
                $('.warning-modal .button-wrapper a[id="warning-proceed"]').click(() => {
                    rememberChoice();
                    payload.confirmed = true;
                    resolve(payload);
                });
                $('.warning-modal .button-wrapper a:not(#warning-proceed)').click(() => {
                    resolve(payload);
                });
            })
        }
    }

    boundaryTypeSelected = (type, currentLevel) => {
        this.setSelectedOption(type);

        let payload = {
            selected_type: type,
            current_level: currentLevel
        }
        this.triggerEvent("boundary_types.option.selected", payload);
    }

    checkIfAlreadyConfirmed = () => {
        return this.readCookie(BOUNDARY_MODAL_COOKIE_NAME) || false;
    }

    rememberChoice = () => {
        let remember = $('input[id="no-show"]').is(':checked');
        if (remember) {
            this.createCookie(BOUNDARY_MODAL_COOKIE_NAME, true, 365);
        }
    }

    createCookie = (name, value, days) => {
        let expires;
        let dayToMs = 24 * 60 * 60 * 1000;

        if (days) {
            let date = new Date();
            date.setTime(date.getTime() + (days * dayToMs));
            expires = "; expires=" + date.toGMTString();
        } else {
            expires = "";
        }
        document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + "; path=/";
    }

    readCookie = (name) => {
        let nameEQ = encodeURIComponent(name) + "=";
        let ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ')
                c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0)
                return decodeURIComponent(c.substring(nameEQ.length, c.length));
        }
        return null;
    }
}
