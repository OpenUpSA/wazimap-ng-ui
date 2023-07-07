export function configureCurrentViewEvents(controller, config, currentViewObj) {
    controller.on('profile.loaded', () => {
        let views = structuredClone(config.views);

        const viewKeys = Object.keys(config.views);
        if (viewKeys.indexOf(config.currentViewData.viewName) < 0) {
            views[config.currentViewData.viewName] = {};
        }

        currentViewObj.createDropdown(views, config.currentViewData);
    })
}