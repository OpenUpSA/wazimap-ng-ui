export function configureTabNoticeEvents(controller, tabNotice) {
    controller.on('profile.loaded', payload => tabNotice.modifyTabNotice(payload.state.profile.profile))
}
