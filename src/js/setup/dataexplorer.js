import {loadMenu} from '../elements/data_mapper/menu';

export function configureDataExplorerEvents(controller, dataMapperMenu) {
    controller.bubbleEvents(dataMapperMenu, ['data_mapper_menu.nodata', 'data_mapper_menu.subcategory.expanded', 'datamapper.reload'])
    controller.on('versions.indicators.ready', (versionData) => {
        loadMenu(dataMapperMenu, versionData.payload);
    })

    controller.on('datamapper.reload', (versionData) => {
        loadMenu(dataMapperMenu, versionData.payload);
    })

    controller.on('hashChange', () => {
        dataMapperMenu.isLoading = true;
    })
}
