import {Component} from "../utils";

export class ConfirmationModal extends Component {
    static  COOKIE_NAMES = {
        BOUNDARY_TYPE_SELECTION: 'boundary_selection',
        DATA_MAPPER_VERSION_SELECTION: 'version_selection'
    };

    constructor(parent, cookieName) {
        super(parent);

        this._isVisible = false;
        this._element = $('.warning-modal:not(.global-loading-modal)');
        this._cookieName = cookieName;

        this.prepareEvents();
    }

    get element() {
        return this._element;
    }

    get isVisible() {
        return this._isVisible;
    }

    set isVisible(value) {
        this._isVisible = value;

        if (value) {
            this.element.removeClass('hidden');
        } else {
            this.element.addClass('hidden');
        }
    }

    get cookieName() {
        return this._cookieName;
    }

    prepareEvents() {
        $('.warning-modal .button-wrapper a').on('click', () => {
            this.isVisible = false;
        });
    }

    checkIfAlreadyConfirmed() {
        return this.readCookie(this.cookieName) || false;
    }

    rememberChoice() {
        let remember = $('input[id="no-show"]').is(':checked');
        if (remember) {
            this.createCookie(this.cookieName, true, 365);
        }
    }

    createCookie(name, value, days) {
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

    readCookie(name) {
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

    askForConfirmation() {
        const self = this;
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
            self.isVisible = true;

            return new Promise(function (resolve) {
                $('.warning-modal .button-wrapper a[id="warning-proceed"]').on('click', () => {
                    self.rememberChoice();
                    payload.confirmed = true;
                    resolve(payload);
                });
                $('.warning-modal .button-wrapper a:not(#warning-proceed)').on('click', () => {
                    resolve(payload);
                });
            })
        }
    }
}