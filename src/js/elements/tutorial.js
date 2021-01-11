let wrapperClass = '.w-slider-mask';
let slideClass = '.w-slide';

export class Tutorial {
    createSlides = (tutorialArr) => {
        if (tutorialArr === null || tutorialArr.length <= 0) {
            return;
        }

        tutorialArr.forEach((t, i) => {
            let item = $(wrapperClass).find(slideClass)[i];
            $('.slide-info__title', item).text(t.title);
            $('.slide-info__introduction', item).text(t.body);
            $('.tutorial__slide-image', item).css('background-image', `url(${t.image})`)
        });
    }
}