import {VersionController} from "../versions/version_controller";

export function configureChoroplethEvents(controller, objs = {mapcontrol: null, mapchip: null, api: null}) {
    const mapcontrol = objs['mapcontrol'];
    const mapchip = objs['mapchip'];
    const api = objs['api'];

    mapchip.on('mapchip.removed', payload => controller.onMapChipRemoved(payload));

    mapchip.on('mapchip.choropleth.filtered', payload => {
        controller.onChoroplethFiltered(payload);
    })

    mapchip.on('mapchip.choropleth.selectSubindicator', payload => {
        controller.onSelectingSubindicator(payload);
    })

    //let the choropleth persist
    controller.on('versions.indicators.ready', payload => {
        handleNewProfileChoropleth(controller, api, mapcontrol)
    })
    controller.on('mapchip.removed', payload => mapcontrol.choropleth.reset(true));
    controller.on('data_mapper_menu.nodata', payload => mapchip.removeMapChip())
    controller.on(VersionController.EVENTS.updated, () => mapchip.removeMapChip())
    controller.bubbleEvents(mapcontrol, ['map.choropleth.display', 'map.choropleth.reset']);


    controller.on('mapchip.choropleth.filtered', payload => {
        payload.payload.indicatorTitle = payload.state.subindicator.indicatorTitle;
        loadAndDisplayChoropleth(payload, mapcontrol, false, payload.payload.data);
    });

    controller.on('mapchip.choropleth.selectSubindicator', payload => {
        loadAndDisplayChoropleth(payload, mapcontrol, false, payload.state.subindicator.data);
    });

    controller.on('hashChange', () => {
        mapchip.isLoading = true;
    })

    controller.on('map.choropleth.display', payload => {
        payload.state.choroplethData = payload.payload.data;
        mapchip.onChoropleth(payload.payload);
    });
    controller.on('map_explorer.subindicator.click', payload => {
        loadAndDisplayChoropleth(payload, mapcontrol, true, null);
    })

    mapcontrol.on('map.choropleth.loaded', args => {
        if (!args.showMapchip) {
            return;
        }

        const metadata = args.metadata;
        const params = {
            metadata: metadata,
            indicatorTitle: args.indicatorTitle,
            selectedSubindicator: args.selectedSubindicator,
            childData: args.data,
            filter: args.filter,
            config: args.config
        }
        mapchip.onSubIndicatorChange(params);
    });

    controller.on('redraw', payload => {
        handleNewProfileChoropleth(controller, api, mapcontrol)
    })
}

function handleNewProfileChoropleth(controller, api, mapcontrol) {
    if (controller.state.subindicator == null) {
        return;
    }

    const geo = controller.state.profile.profile.geography.code;
    const profileId = controller.state.profileId;
    const indicatorId = controller.state.subindicator.indicatorId;
    const metadata = controller.state.subindicator.metadata;
    const config = controller.state.subindicator.config;
    const indicatorTitle = controller.state.subindicator.indicatorTitle;

    api.getIndicatorChildData(profileId, geo, indicatorId)
        .then((childData) => {
            if (Object.keys(childData).length === 0) {
                controller.triggerEvent('data_mapper_menu.nodata');
                return;
            }

            let payload = {
                state: controller.state,
                payload: {
                    metadata: metadata,
                    indicatorTitle: indicatorTitle,
                    config: config
                }
            }

            loadAndDisplayChoropleth(payload, mapcontrol, true, childData);
        })
}

function loadAndDisplayChoropleth(payload, mapcontrol, showMapchip = false, childData = null) {
    const geo = payload.state.profile.geometries.boundary.properties.code;
    const ps = payload.state;
    const metadata = payload.payload.metadata;
    const config = payload.payload.config;
    if (ps.subindicator === null)
        return;

    const method = ps.subindicator.choropleth_method;
    const indicatorTitle = payload.payload.indicatorTitle;
    const selectedSubindicator = ps.selectedSubindicator;
    const filter = ps.subindicator.filter;
    let data = ps.subindicator.data;
    if (childData) {
        ps.subindicator.data = childData;
        data = childData;
    }

    mapcontrol.handleChoropleth(data, method, selectedSubindicator, indicatorTitle, showMapchip, filter, metadata, config);
}
