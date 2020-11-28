export function configureInfoboxEvents(controller, components) {
    controller.on('profileLoaded', payload => components.locationInfoBox.update(payload.state.profile))
    controller.on('profile.loaded', payload => components.locationInfoBox.update(payload.payload))

    controller.on('layerClick', payload => {
        if (payload.state.mapLoading == true) {
            return
        }

        let properties = payload.payload.properties;
        let locations = [{
            name: properties.name,
            level: properties.level
        }];
        components.locationInfoBox.updateLocations(locations);
    })
}
