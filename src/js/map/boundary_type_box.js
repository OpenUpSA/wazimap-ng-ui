import {Observable} from "../utils";

let selectElement = $('.map-geo-select')[0];
let selectedOption = null;
let optionWrapper = null;
let optionItem = null;
let cookieName = 'boundary_selection';

export class BoundaryTypeBox extends Observable {
    constructor(preferred_children) {
        super();

        this.preferred_children = preferred_children;

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
        if (typeof this.preferred_children === 'undefined') {
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
        let result = false;
        let cookie = this.readCookie(cookieName);
        if (cookie !== null) {
            result = cookie;
        }

        return result;
    }

    rememberChoice = () => {
        let remember = $('input[id="no-show"]').is(':checked');
        if (remember) {
            console.log('here')
            this.createCookie(cookieName, true, 365);
        }
    }

    createCookie = (name, value, days) => {
        let expires;

        if (days) {
            let date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
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