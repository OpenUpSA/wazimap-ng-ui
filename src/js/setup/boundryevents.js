export function configureBoundryEvents(controller,boundryTypeBox) {
    controller.on('profile.loaded', payload => {
        boundryTypeBox.populateBoundryOptions(payload.payload.geometries.children);
    });
}