import {loadMenu} from '../elements/menu';

export function configureDataExplorerEvents(controller, dataMapperMenu, profileId, api) {
    //todo:come back to this
    controller.bubbleEvent(dataMapperMenu, 'data_mapper_menu.nodata')
    controller.on('versions.indicators.ready', (versionData) => {
        loadMenu(dataMapperMenu, versionData.payload, payload => {
            controller.onSubIndicatorClick(payload)
        })
    })
    /*
    controller.on('hashChange', payload => {
        const profileId = payload.state.profileId;
        const areaCode = payload.payload.areaCode;

        api.getChildrenIndicators(profileId, areaCode)
            .then((data) => {
                loadMenu(dataMapperMenu, data, payload => {
                    controller.onSubIndicatorClick(payload)
                })
            })
    })
    */

    return;


    return;
    controller.on('versions.all.loaded', payload => {
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

    controller.on('hashChange', () => {
        dataMapperMenu.isLoading = true;
    })
}