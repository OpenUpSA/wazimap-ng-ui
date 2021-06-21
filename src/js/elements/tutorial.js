import {Component} from '../utils';

export class Tutorial extends Component {
    constructor(parent) {
        super(parent)

        this.wrapperClass = '.w-slider-mask';
        this.slideClass = '.w-slide';
    }

    createSlides = (tutorialArr) => {
        let tutorials = tutorialArr || [];

        tutorials.forEach((slide, i) => {
            let item = $(this.wrapperClass).find(this.slideClass)[i];
            $('.slide-info__title', item).text(slide.title);
            $('.slide-info__introduction', item).text(slide.body);
            $('.tutorial__slide-image', item).css('background-image', `url(${slide.image})`);
        });
    }
}
