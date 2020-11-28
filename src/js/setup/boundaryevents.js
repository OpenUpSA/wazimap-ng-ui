export function configureBoundaryEvents(controller, components) {
    controller.on('profile.loaded', payload => {
        let children = payload.payload.geometries.children;
        let currentLevel = payload.payload.geometries.boundary.properties.level;

        components.boundaryTypeBox.populateBoundaryOptions(children, currentLevel);
    });

    components.boundaryTypeBox.on('boundary_types.option.selected', (payload) => {
        controller.onBoundaryTypeChange(payload);
    })
}