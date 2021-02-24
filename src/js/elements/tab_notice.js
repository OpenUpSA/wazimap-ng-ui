export class TabNotice {
    constructor() {
        this.tab = $('.tab-notice');
    }

    modifyTabNotice = (profile) => {
        if (typeof profile.feedback === 'undefined' || profile.feedback === null) {
            return;
        }

        if (profile.feedback.visible) {
            this.tab.removeClass('hidden');
        } else {
            this.tab.addClass('hidden');
        }

        this.tab.find('a.tab-notice__content').attr('href', profile.feedback.url);
        this.tab.find('a.tab-notice__content .tab-notice__text').text(profile.feedback.text);
    }
}