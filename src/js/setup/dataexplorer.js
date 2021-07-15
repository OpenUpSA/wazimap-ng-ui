import { DataMapperMenu } from '../elements/menu';

export function configureDataExplorerEvents(controller, dataMapperMenu) {
  controller.bubbleEvent(dataMapperMenu, 'data_mapper_menu.nodata')
  controller.on('profile.loaded', payload => {
    const dataMenu = new DataMapperMenu(dataMapperMenu);
    if ($.isEmptyObject(payload.payload.geometries.children)) {
      //no children -- show no-data chip
      dataMenu.showNoDataMessage();
    } else {
      const profileData = payload.payload.profile.profileData;
      dataMenu.init(profileData, payload => {
        controller.onSubIndicatorClick(payload)
      });
    }
  });
}
