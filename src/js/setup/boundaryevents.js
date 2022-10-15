import {VersionController} from "../versions/version_controller";

export function configureBoundaryEvents(controller, boundaryTypeBox) {
    controller.on(VersionController.EVENTS.ready, payload => {
        let children = payload.payload.geometries.children;
        let currentLevel = payload.payload.geometries.boundary.properties.level;
        boundaryTypeBox.activeVersion = controller.versionController.activeVersion;
        boundaryTypeBox.populateBoundaryOptions(
            controller.versionController.versionGeometries,
            currentLevel,
            controller.versionController.versions
        );
    });

    controller.on(VersionController.EVENTS.updated, (payload) => {
        boundaryTypeBox.activeVersionUpdated(
          payload.payload.geometries,
          controller.versionController.activeVersion,
          controller.state.preferredChild
        )
    }

    );

    boundaryTypeBox.on('boundary_types.option.selected', (payload) => {
        controller.onBoundaryTypeChange(payload);
        controller.versionController.setActiveVersionByName(
            payload.selected_version_name
        );
    })
}
