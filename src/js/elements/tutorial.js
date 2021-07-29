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

            // hardcode fix of slides
            if (i == 6) {
                let intro = $('.slide-info__introduction', item);
                intro.remove();
                let slide = $('.tutorial__slide-info', item);
                slide.append('<div><span class="slide-info__title bg-primary"></span><span class="slide-info__introduction"></span></div>');
            }

            else if (i == 7) {
                let title = $('.slide-info__title', item);
                title.remove();
                let intro = $('.slide-info__introduction', item);
                intro.remove();

                let slide = $('.tutorial__slide-info', item);
                slide.append('<div><span class="slide-info__title bg-primary"></span><a href="https://openup.gitbook.io/wazimap-ng-user-guide/" target="_blank"><span class="slide-info__introduction"></span></a></div>');
            }

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
