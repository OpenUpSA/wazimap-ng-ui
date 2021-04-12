import {Observable} from "../utils";
import i18next from 'i18next';

export class Translations extends Observable {
    constructor(translations) {
        super();

        this.translations = translations;
    }

    translate() {
        if (typeof this.translations === 'undefined') {
            return;
        }

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