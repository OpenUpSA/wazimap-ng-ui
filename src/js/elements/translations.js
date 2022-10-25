import {Component} from "../utils";
import i18next from 'i18next';

export class Translations extends Component {
    constructor(parent, translations) {
        super(parent);

        this.translations = translations;
        this._t = null;
    }

    get t() {
        return this._t;
    }

    set t(value) {
        this._t = value;
    }

    translate() {
        if (this.translations === undefined) {
            return;
        }

        const self = this;

        Object.keys(self.translations).forEach((key) => {
            self.translations[key] = {translation: self.translations[key]}
        })

        // if t is initialized it means all the translations are done already
        // no need to run this code more than once
        if (self.t === null) {
            i18next
                .init({
                    lng: 'en',
                    resources: self.translations,
                    initImmediate: true
                })
                .then(
                    function (t) {
                        self.t = t;
                        self.modifyElements();
                    });
        }
    }

    modifyElements() {
        const self = this;
        $('.i18n').each(function () {
            $(this).html(self.t($(this).attr('data-i18n')));
        });

        $('.i18n-placeholder').each(function () {
            $(this).attr("placeholder", self.t($(this).attr('data-i18n')));
        });
    }
}
