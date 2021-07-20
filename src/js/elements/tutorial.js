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
            this.setTextOrLogError('.slide-info__title', item, slide.title, i);
            this.setTextOrLogError('.slide-info__introduction', item, slide.body, i);
            $('.tutorial__slide-image', item).css('background-image', `url(${slide.image})`);
        });
    }

    setTextOrLogError = (cls, item, text, index) => {
        let ele = $(cls, item);
        if (ele.length <= 0) {
            console.error(`Missing html element in slide ${index + 1} : ${cls}`);
            return;
        }
        ele.text(text);
    }
}
