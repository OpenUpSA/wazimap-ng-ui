import html from '../../src/index.html';
import {Tutorial} from '../../src/js/elements/tutorial';
import {Component} from "../../src/js/utils";

describe('Tutorials', () => {
    let tutorialModal;
    let tutorialArr = [{
        body: 'body A',
        image: 'https://wazimap-ng.s3-eu-west-1.amazonaws.com/africa-data-hub/wazi-tut-1.png',
        title: 'Title A:'
    }, {
        body: 'Body B',
        image: 'https://wazimap-ng.s3-eu-west-1.amazonaws.com/africa-data-hub/wazi-tut-2.png',
        title: 'Title B:'
    }, {
        body: 'Body C',
        image: 'https://wazimap-ng.s3-eu-west-1.amazonaws.com/africa-data-hub/wazi-tut-3.png',
        title: 'Title C:'
    }, {
        body: 'body d',
        image: 'https://wazimap-ng.s3-eu-west-1.amazonaws.com/africa-data-hub/wazi-tut-4.png',
        title: 'title d'
    }, {
        body: 'body e',
        image: 'https://wazimap-ng.s3-eu-west-1.amazonaws.com/africa-data-hub/wazi-tut-5.png',
        title: 'title e:'
    }, {
        body: 'body f',
        image: 'https://wazimap-ng.s3-eu-west-1.amazonaws.com/africa-data-hub/wazi-tut-6.png',
        title: 'title f'
    }, {
        body: 'body g',
        image: 'https://wazimap-ng.s3-eu-west-1.amazonaws.com/africa-data-hub/wazi-tut-7.png',
        title: 'title g'
    }, {
        body: 'body h',
        image: 'https://wazimap-ng.s3-eu-west-1.amazonaws.com/africa-data-hub/wazi-tut-8.png',
        title: 'title h'
    }];

    beforeEach(() => {
        document.body.innerHTML = html;
        tutorialModal = $('.tutorial-modal');
    })

    test('there are 8 slides', () => {
        let len = tutorialModal.find('.slide').length;
        expect(len).toBe(8);
    })

    describe('html structure is correct', () => {
        test('tutorial__slide-content element is found', () => {
            tutorialModal.find('.slide').each(function () {
                let slideContentLen = $(this).find('.tutorial__slide-content').length;
                expect(slideContentLen).toBe(1);
            })
        })

        test('tutorial__slide-info element is found', () => {
            tutorialModal.find('.slide').each(function () {
                let slideInfoLen = $(this).find('.tutorial__slide-content .tutorial__slide-info').length;
                expect(slideInfoLen).toBe(1);
            })
        })

        test('slide-info__title element is found', () => {
            tutorialModal.find('.slide').each(function () {
                let slideTitleLen = $(this).find('.tutorial__slide-content .tutorial__slide-info .slide-info__title').length;
                expect(slideTitleLen).toBe(1);
            })
        })

        test('slide-info__introduction element is found', () => {
            let c = new Component();
            let t = new Tutorial(c);
            t.createSlides(tutorialArr);

            tutorialModal.find('.slide').each(function () {
                let slideIntroLen = $(this).find('.tutorial__slide-content .tutorial__slide-info .slide-info__introduction').length;
                expect(slideIntroLen).toBe(1);
            })
        })

        test('tutorial__slide-image element is found', () => {
            tutorialModal.find('.slide').each(function () {
                let slideImageLen = $(this).find('.tutorial__slide-content .tutorial__slide-image').length;
                expect(slideImageLen).toBe(1);
            })
        })

        test('title is set correctly', () => {
            let c = new Component();
            let t = new Tutorial(c);
            t.createSlides(tutorialArr);

            tutorialModal.find('.slide').each(function (i) {
                let titleEle = $(this).find('.tutorial__slide-content .tutorial__slide-info .slide-info__title');
                expect(titleEle.text()).toBe(tutorialArr[i].title);
            })
        })

        test('introduction is set correctly', () => {
            let c = new Component();
            let t = new Tutorial(c);
            t.createSlides(tutorialArr);

            tutorialModal.find('.slide').each(function (i) {
                let introEle = $(this).find('.tutorial__slide-content .tutorial__slide-info .slide-info__introduction');
                expect(introEle.text()).toBe(tutorialArr[i].body);
            })
        })

        test('image is set correctly', () => {
            let c = new Component();
            let t = new Tutorial(c);
            t.createSlides(tutorialArr);

            tutorialModal.find('.slide').each(function (i) {
                let imageEle = $(this).find('.tutorial__slide-content .tutorial__slide-image');
                expect(imageEle.css('background-image')).toBe(`url(${tutorialArr[i].image})`);
            })
        })
    })
})