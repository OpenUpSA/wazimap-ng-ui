export function configureInfoboxEvents(controller, locationInfoBox) {
    controller.on('profileLoaded', payload => locationInfoBox.update(payload.state.profile))
    controller.on('profile.loaded', payload => locationInfoBox.update(payload.payload))

    controller.on('layerClick', payload => {
        if (payload.state.mapLoading == true) {
            return
        }

        let properties = payload.payload.properties;
        let locations = [{
            name: properties.name,
            level: properties.level
        }];
        locationInfoBox.updateLocations(locations);
    })
}
