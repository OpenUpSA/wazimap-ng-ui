import {VersionController} from "../versions/version_controller";

export function configureChoroplethEvents(controller, objs = {mapcontrol: null, mapchip: null}) {
    const mapcontrol = objs['mapcontrol'];
    const mapchip = objs['mapchip'];

    mapchip.on('mapchip.removed', payload => controller.onMapChipRemoved(payload));
    mapchip.on('mapchip.choropleth.filtered', payload => {
        controller.onChoroplethFiltered(payload);
    })

    //let the choropleth persist
    controller.on('profile.loaded', payload => controller.handleNewProfileChoropleth())
    controller.on('mapchip.removed', payload => mapcontrol.choropleth.reset(true));
    controller.on('data_mapper_menu.nodata', payload => mapchip.removeMapChip())
    controller.on(VersionController.EVENTS.updated, () => mapchip.removeMapChip())
    controller.bubbleEvents(mapcontrol, ['map.choropleth.display', 'map.choropleth.reset']);

    controller.on('mapchip.choropleth.filtered', payload => {
        payload.payload.indicatorTitle = payload.state.subindicator.indicatorTitle;

        loadAndDisplayChoropleth(payload, mapcontrol, false, payload.payload.data);
    })

    controller.on('newProfileWithChoropleth', args => {
        setTimeout(() => {
            loadAndDisplayChoropleth(args, mapcontrol, true, null);
        }, 0);
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

        const metadata = args.data.metadata;
        const params = {
            primaryGroup: metadata.primary_group,
            groups: metadata.groups,
            indicatorTitle: args.indicatorTitle,
            selectedSubindicator: args.selectedSubindicator,
            childData: args.data.data,
            description: args.data.description,
            chartConfiguration: args.data.chartConfiguration,
            filter: args.filter,
        }
        mapchip.onSubIndicatorChange(params);
    });

    controller.on('redraw', payload => {
        controller.handleNewProfileChoropleth()
    })
}

function loadAndDisplayChoropleth(payload, mapcontrol, showMapchip = false, childData = null) {
    const geo = payload.state.profile.geometries.boundary.properties.code;
    const ps = payload.state;
    if (ps.subindicator == null)
        return

    const method = ps.subindicator.choropleth_method;
    const indicatorTitle = payload.payload.indicatorTitle;
    const selectedSubindicator = ps.selectedSubindicator;
    const filter = ps.subindicator.filter;
    let data = ps.subindicator.data
    if (childData) {
        data.originalChildData = (data.originalChildData !== undefined) ? data.originalChildData : data.data;
        data.data = childData;
    }
    mapcontrol.handleChoropleth(data, method, selectedSubindicator, indicatorTitle, showMapchip, filter);
}
