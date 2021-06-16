import {Component} from "../utils";
import i18next from 'i18next';

export class Translations extends Component {
    constructor(parent, translations) {
        super(parent);

        this.translations = translations;
    }

    translate() {
        if (typeof this.translations === 'undefined') {
            return;
        }

        Object.keys(this.translations).forEach((key) => {
            this.translations[key] = {translation: this.translations[key]}
        })

        i18next
            .init({
                lng: 'en',
                resources: this.translations
            })
            .then(
                function (t) {
                    $('.i18n').each(function () {
                        $(this).html(t($(this).attr('data-i18n')));
                    });
                }
            )
        ;
    }
}
