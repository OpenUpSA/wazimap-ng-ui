import {VersionController} from "../versions/version_controller";

export function configureInfoboxEvents(controller, locationInfoBox) {
    controller.on('profileLoaded', payload => locationInfoBox.update(payload.state.profile))
    controller.on('profile.loaded', payload => locationInfoBox.update(payload.payload))
    controller.on(VersionController.EVENTS.updated, () => locationInfoBox.update(controller.versionController.versionBundles[controller.versionController.activeVersion.model.name]))

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
