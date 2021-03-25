import {Observable} from '../utils';

export const EVENTS = {
    next: 'tutorial.nextSlide',
    prev: 'tutorial.previousSlide',
}

export class Tutorial extends Observable {
    constructor() {
        super();
        this.wrapperClass = '.w-slider-mask';
        this.slideClass = '.w-slide';
        
        this.tutorials = [];
        this.curIdx = 0;
    }
    
    _preloadImages = () => {
        this.tutorials.forEach(slide => {
            let img = new Image();
            img.src = slide.image;
        })
    }
    
    prepareDomElements = () => {
        this.tutorialContainer = $('.tutorial');
        this.tutorialSlider = $('.tutorial__slider');
        this.rightButton = $('.right-arrow', this.tutorialSlider);
        this.leftButton = $('.left-arrow', this.tutorialSlider);
        this.rightButton.off('click')
        this.leftButton.off('click')
        
        this.rightButton.on("click", () => this.nextSlide());
        this.leftButton.on("click", () => this.prevSlide());
        
        this.tutorialPageNumber = $('.tutorial__slide-number', this.tutorialContainer);
    }

    createSlides = (tutorialArr) => {
        this.tutorials = tutorialArr || [];
        if (this.tutorials.length > 0) {
            this._preloadImages()
            this.prepareDomElements(); 
            this.updateSlideNumber()
 
        }
    }
    
    createPayload = () => {
        return {
            slide: this.curIdx
        }
    }
    
    nextSlide = () => {
        if (this.curIdx + 1 < this.tutorials.length)
            this.curIdx++;
        else
            this.curIdx = 0;
        
        this.displaySlide(this.curIdx);
        
        const payload = this.createPayload();
        this.triggerEvent(EVENTS.next, payload);
    }

    prevSlide = () => {
        if (this.curIdx == 0)
            this.curIdx = this.tutorials.length - 1;
        else
            this.curIdx--
        
        this.displaySlide(this.curIdx);

        const payload = this.createPayload();
        this.triggerEvent(EVENTS.prev, payload);
    }
    
    displaySlide = (slideIdx) => {
        this.curIdx = slideIdx;
        const numSlides = this.tutorials.length;
        
        if (numSlides < this.curIdx + 1) {
            console.error(`Could not display tutorial slide ${this.curIdx} as there are only ${numSlides} slides`);
            return
        }
        
        const slide = this.tutorials[this.curIdx];
        
        let item = $(this.wrapperClass).find(this.slideClass)[0];
        $('.slide-info__title', item).text(slide.title);
        $('.slide-info__introduction', item).text(slide.body);
        $('.tutorial__slide-image', item).css('background-image', `url(${slide.image})`);
        
        this.updateSlideNumber();
    }
    
    updateSlideNumber = () => {
        const currentSlide = this.curIdx + 1;
        const numSlides = this.tutorials.length;
        this.tutorialPageNumber.text(`${currentSlide}/${numSlides}`);
    }
}