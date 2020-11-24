export function configureBoundaryEvents(controller, boundaryTypeBox) {
    controller.on('profile.loaded', payload => {
        let children = payload.payload.geometries.children;
        let currentLevel = payload.payload.geometries.boundary.properties.level;

        boundaryTypeBox.populateBoundaryOptions(children, currentLevel);
    });

    boundaryTypeBox.on('boundary_types.option.selected', (payload) => {
        controller.onBoundaryTypeChange(payload);
    })
}