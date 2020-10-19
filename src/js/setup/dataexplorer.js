import {loadMenu, showNoData} from '../elements/menu';

export function configureDataExplorerEvents(controller) {
    controller.on('profile.loaded', payload => {
        if ($.isEmptyObject(payload.payload.geometries.children)) {
            //no children -- show no-data chip
            showNoData();
        } else {
            loadMenu(payload.payload.profile.profileData, payload => {
                controller.onSubIndicatorClick(payload)
            })
        }
    })
}
