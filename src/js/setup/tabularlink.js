export function configureTabularLinkEvents(controller, config, tabularLinkObj) {
    controller.on('profile.loaded', () => {
        if (!config.tabularLinkEnabled){
            return;
        }

        tabularLinkObj.checkAndCreateButton();
    })
}