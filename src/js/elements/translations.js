import {Observable} from "../utils";
import i18next from 'i18next';

export class Translations extends Observable {
    constructor(translations) {
        super();

        this.translations = translations;
    }

    translate() {
        //todo:remove this when the BE is ready
        if (typeof this.translations === 'undefined') {
            this.translations = {
                en: {
                    translation: {
                        'Point Mapper': 'Service Mapper',
                        'lorem ipsum': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam a lacinia diam. Aliquam sollicitudin lectus ipsum,'
                    }
                }
            }
        }
        //remove this when the BE is ready

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