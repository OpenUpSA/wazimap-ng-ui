import {loadMenu, showNoData, DataMenu} from '../elements/menu';

export function configureDataExplorerEvents(controller, dataMapperMenu) {
    controller.bubbleEvent(dataMapperMenu, 'data_mapper_menu.nodata')
    controller.on('profile.loaded', payload => {
        console.log(payload);
        if ($.isEmptyObject(payload.payload.geometries.children)) {
            //no children -- show no-data chip
            dataMapperMenu.showNoData();
        } else {
            const profileData = payload.payload.profile.profileData;
            loadMenu(dataMapperMenu, profileData, payload => {
                controller.onSubIndicatorClick(payload)
            })
        }
    })
}
