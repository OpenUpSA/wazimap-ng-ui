import {ZoomToggle} from "../mapmenu/zoomtoggle";
import {VersionController} from "../versions/version_controller";

export const zoomToggle = new ZoomToggle();

export function configureMapEvents(controller, objs = {mapcontrol: null}) {
    const mapcontrol = objs['mapcontrol'];

    controller.on('layer.mouse.over', payload => mapcontrol.popup.loadPopup(payload.payload, payload.state));
    controller.on('layer.mouse.out', payload => mapcontrol.popup.hidePopup(payload));
    controller.on('layer.mouse.move', payload => mapcontrol.popup.updatePopupPosition(payload));
    controller.on('profile.loaded', payload => {
        const geography = payload.payload.profile.geography;
        const geometries = payload.payload.geometries;
        setTimeout(() => {
            mapcontrol.overlayBoundaries(geography, geometries);
        }, 0)
    });

    controller.on('redraw', payload => {
        const geography = payload.payload.profile.geography;
        const geometries = payload.payload.geometries;
        setTimeout(() => {
            mapcontrol.overlayBoundaries(geography, geometries);
        }, 0)
    });

    controller.on(VersionController.EVENTS.updated, payload => {
        const geography = payload.payload.profile.geography;
        const geometries = payload.payload.geometries;
        setTimeout(() => {
            mapcontrol.overlayBoundaries(geography, geometries);
        }, 0)
    });


    controller.bubbleEvent(zoomToggle, 'zoomToggled');
    controller.bubbleEvents(mapcontrol, [
        'layer.mouse.over', 'layer.mouse.out', 'layer.mouse.move',
        'map.layer.loading', 'map.zoomed'
    ])
    mapcontrol.on('map.layer.loaded', payload => controller.onLayerLoaded(payload))
    mapcontrol.on('layerClick', payload => controller.onLayerClick(payload));
    controller.on('zoomToggled', payload => mapcontrol.enableZoom(payload.payload.enabled));
}
