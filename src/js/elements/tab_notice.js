import {Observable} from '../utils';

export const EVENTS = {
    clicked: 'tab_notice.clicked'
}

export class TabNotice extends Observable {
    constructor(feedback) {
        super()
        this.tab = $('.tab-notice');
        this.feedback = feedback;
    }

    modifyTabNotice = () => {
        if (typeof this.feedback === 'undefined' || this.feedback === null) {
            return;
        }

        if (this.feedback.visible) {
            this.tab.removeClass('hidden');
        } else {
            this.tab.addClass('hidden');
        }

        this.tab.find('a.tab-notice__content').attr('href', this.feedback.url);
        this.tab.find('a.tab-notice__content .tab-notice__text').text(this.feedback.text);
        this.tab.on('click', () => this.triggerEvent(EVENTS.clicked))
    }
}