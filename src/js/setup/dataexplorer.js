import {loadMenu} from '../elements/data_mapper/menu';

export function configureDataExplorerEvents(controller, dataMapperMenu) {
    controller.bubbleEvents(dataMapperMenu, ['data_mapper_menu.nodata', 'data_mapper_menu.subcategory.expanded'])
    controller.on('versions.indicators.ready', (versionData) => {
        let data = versionData.payload;
        if (JSON.stringify(data) === JSON.stringify({})) {
            //no children -- show no-data chip
            dataMapperMenu.showNoData();
        } else {
            loadMenu(dataMapperMenu, data)
        }
    })

    controller.on('data_mapper_menu.subcategory.expanded', (payload) => {
        dataMapperMenu.loadAndAddSubIndicators(payload.payload, payload.state.profileId, payload.state.profile.profile.geography.code, callBack => {
            controller.onSubIndicatorClick(callBack)
        });
    })

    controller.on('hashChange', () => {
        dataMapperMenu.isLoading = true;
    })

    controller.on('my_view.filteredIndicators.removed', payload => {
        console.log({dataMapperMenu})
    })
}
