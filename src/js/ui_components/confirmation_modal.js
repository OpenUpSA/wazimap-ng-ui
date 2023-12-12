import {Component} from "../utils";

export class ConfirmationModal extends Component {
    static  COOKIE_NAMES = {
        BOUNDARY_TYPE_SELECTION: 'boundary_selection',
        DATA_MAPPER_VERSION_SELECTION: 'version_selection',
        CC_LICENSE: 'cc_license'
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
            this.setContent();
            this.element.removeClass('hidden');
        } else {
            this.element.addClass('hidden');
        }
    }

    get cookieName() {
        return this._cookieName;
    }

    setContent() {
        const licenseContent = $('.warning-modal .warning .license__content');
        if (this.cookieName === ConfirmationModal.COOKIE_NAMES.CC_LICENSE) {
            if (licenseContent.length <= 0) {
                const p = document.createElement('p');
                $(p).text('Dear User, We\'re thrilled you found value in Youth Explorer\'s data! If you intend to use or reference this data in your work, we kindly request that you include proper citations to acknowledge the source. This not only respects the efforts put into compiling this information but also helps others locate and benefit from it. Thank you for your cooperation and dedication to accurate attributions!');

                const license__content = document.createElement('div');
                $(license__content).addClass('license__content');
                $(license__content).append(p);
                $('.warning-modal .warning').prepend(license__content);
            }

            $('.warning-modal .warning .warning__content').addClass('hidden');
            $('.warning-modal .warning .license__content').removeClass('hidden');
            $('.warning-modal .warning .warning__header').addClass('hidden');
        } else {
            $('.warning-modal .warning .warning__content').removeClass('hidden');
            $('.warning-modal .warning .license__content').addClass('hidden');
            $('.warning-modal .warning .warning__header').removeClass('hidden');
        }
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