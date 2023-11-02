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

        let viewArr = Object.keys(views).filter(x => x !== config.defaultViewLabel).map(key => {
            return {...views[key], name: key};
        })

        viewArr.sort((x, y) => x.order == null || x.order > y.order ? 1 : -1);

        // add default
        viewArr.unshift({
            url: window.location.origin,
            name: config.defaultViewLabel
        })

        currentViewObj.checkAndCreateDropdown(viewArr, config.currentViewData);
    })
}