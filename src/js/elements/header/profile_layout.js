import {Component} from '../../utils';

const logoContainer = $('img.profile-logo');

export class ProfileLayout extends Component {
    constructor(parent) {
        super(parent);
    }

    displayLogo(logo) {
        let fullUrl = `${logo.image}`;
        $('.nav__title div').css('display', 'none');
        logoContainer.attr('src', fullUrl);
        logoContainer.css('display', 'block')

        $(".nav__content_title").attr("href", logo.url);
    }
}
