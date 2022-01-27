import {loadMenu} from '../elements/menu';

export function configureDataExplorerEvents(controller, dataMapperMenu) {
    //todo:come back to this
    controller.bubbleEvent(dataMapperMenu, 'data_mapper_menu.nodata')
    controller.on('versions.indicators.ready', (versionData) => {
        let children = versionData.state.profile.geometries.children;
        if ($.isEmptyObject(children)) {
            //no children -- show no-data chip
            dataMapperMenu.showNoData();
        } else {
            loadMenu(dataMapperMenu, versionData.payload, payload => {
                controller.onSubIndicatorClick(payload)
            })
        }
    })

    controller.on('hashChange', () => {
        dataMapperMenu.isLoading = true;
    })
}