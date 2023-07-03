export function configureCurrentViewEvents(controller, config, currentViewObj) {
    controller.on('profile.loaded', () => {
        console.log({config})
        const viewsArr = Object.keys(config.views)
        currentViewObj.createDropdown(viewsArr);
    })
}