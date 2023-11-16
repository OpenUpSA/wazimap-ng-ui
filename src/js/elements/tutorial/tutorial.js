import {Component} from '../../utils';
import {createRoot} from "react-dom/client";
import TutorialButton from "./tutorial_button";
import React from "react";
import xss from 'xss';


const allowedTags = ['a', 'b', 'em', 'span', 'i', 'div', 'p', 'ul', 'li', 'ol', 'table', 'tr', 'td', 'th'];
const allowedAttributes = ["class", "target", "style", "href"];
const xssOptions = {
    stripIgnoreTag: true,
    onTag: function (tag, html, options) {
        if (allowedTags.indexOf(tag) === -1) {
            return '';
        }
    },
    onTagAttr: function (tag, name, value, isWhiteAttr) {
        if (allowedAttributes.indexOf(name) >= 0) {
            return name + '="' + xss.escapeAttrValue(value) + '"';
        }
    },
    onIgnoreTagAttr: function (tag, name, value, isWhiteAttr) {
        if (name.substr(0, 5) === "data-") {
            return name + '="' + xss.escapeAttrValue(value) + '"';
        }
    }
};

const xssFilter = new xss.FilterXSS(xssOptions);

export class Tutorial extends Component {
    constructor(parent) {
        super(parent)

        this.wrapperClass = '.w-slider-mask';
        this.slideClass = '.w-slide';
        this.nextButton = '.w-slider-arrow-right .tutorial__slide_button';
        this.prevButton = '.w-slider-arrow-left .tutorial__slide_button';
    }

    addTutorialButton(feedbackBtnVisible) {
        let container = window.document.createElement('div');
        container.classList.add('tutorial-button-container');
        window.document.getElementsByClassName('main')[0].append(container);

        const root = createRoot(container);
        root.render(
            <TutorialButton
                displayTutorialDialog={this.displayTutorialDialog}
                feedbackBtnVisible={feedbackBtnVisible}
            />
        )
    }

    createSlides = (tutorialArr) => {
        let tutorials = tutorialArr || [];
        let container = $(this.wrapperClass);
        let nextButton = $(this.nextButton);
        let prevButton = $(this.prevButton);
        let currentIndex = 0;
        var items = container.find(this.slideClass);
        var clonedItem = items.first().clone();

        let self = this;
        if (tutorials.length > 0) {
            items.remove();
            tutorials.forEach((slide, i) => {
                let item = clonedItem.clone();
                item.find(".slide-info__title").html(xssFilter.process(slide.title));
                item.find(".slide-info__introduction").html(xssFilter.process(slide.text));
                item.find(".tutorial__slide-number").html(`<div>${i+1}/${tutorialArr.length}</div>`);
                item.find(".tutorial__slide-image").css('background-image', `url(${slide.image})`);
                container.append(item);
            });

            nextButton.click(function() {
                currentIndex = (currentIndex + 1) % tutorials.length;
                self.updateCarousel(currentIndex);
            });

            prevButton.click(function() {
                currentIndex = (currentIndex - 1 + tutorials.length) % tutorials.length;
                self.updateCarousel(currentIndex);
            });

        }

    }
    updateCarousel = (currentIndex) => {
        $(this.slideClass).hide();
        $(this.slideClass).eq(currentIndex).show();
    }

    setTextOrLogError = (cls, item, text, index) => {
        let ele = $(cls, item);
        if (ele.length <= 0) {
            console.error(`Missing html element in slide ${index + 1} : ${cls}`);
            return;
        }
        ele.text(text);
    }

    displayTutorialDialog() {
        $('.tutorial-modal').css('display', 'flex');
    }
}
