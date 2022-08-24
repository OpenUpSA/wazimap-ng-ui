import {VersionController} from "../versions/version_controller";

export function configureBoundaryEvents(controller, boundaryTypeBox) {
    controller.on(VersionController.EVENTS.ready, payload => {
        let children = payload.payload.geometries.children;
        let currentLevel = payload.payload.geometries.boundary.properties.level;
        boundaryTypeBox.activeVersion = controller.versionController.activeVersion;
        boundaryTypeBox.populateBoundaryOptions(
            children, currentLevel, controller.versionController.versions,
            controller.versionController.versionGeometries
          );
    });

    controller.on(VersionController.EVENTS.updated,() => boundaryTypeBox.activeVersionUpdated(controller.versionController.activeVersion));

    boundaryTypeBox.on('boundary_types.option.selected', (payload) => {
        controller.onBoundaryTypeChange(payload);
        controller.versionController.setActiveVersionByName(payload.selected_version_name);
    })
}
