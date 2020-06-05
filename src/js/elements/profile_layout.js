import {Observable} from '../utils';

const logoContainer = $('img.profile-logo');

export class ProfileLayout extends Observable {
    constructor(baseUrl) {
        super();
    }

    displayLogo(logo) {
        let fullUrl = `${logo.image}`;
        $('.nav__title div').css('display', 'none');
        logoContainer.attr('src', fullUrl);
        logoContainer.css('display', 'block')

        $(".nav__title").attr("href", logo.url);
    }
}
