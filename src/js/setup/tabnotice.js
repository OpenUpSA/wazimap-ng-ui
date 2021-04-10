import {EVENTS} from '../elements/tab_notice';

export function configureTabNoticeEvents(controller, tabNotice) {
    controller.on('profile.loaded', payload => tabNotice.modifyTabNotice())
    tabNotice.on(EVENTS.clicked, payload => {
        controller.onTabClicked(EVENTS.clicked);
    })
}
