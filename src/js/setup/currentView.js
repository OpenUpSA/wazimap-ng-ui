export function configureCurrentViewEvents(controller, config, currentViewObj) {
    controller.on('profile.loaded', () => {
        let views = structuredClone(config.views);

        if (Object.keys(views).length === 0) {
            // no views
            return;
        }

        const viewKeys = Object.keys(config.views);
        if (viewKeys.indexOf(config.currentViewData.viewName) < 0) {
            views[config.currentViewData.viewName] = {};
        }

        currentViewObj.checkAndCreateDropdown(views, config.currentViewData);
    })
}