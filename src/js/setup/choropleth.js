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

        mapchip.onSubIndicatorChange(args);
    });

    controller.on('profile.chart.choroplethClicked', (payload) => {
        const subindicator = {
            indicatorTitle: payload.payload.indicatorTitle,
            selectedSubindicator: payload.payload.selectedSubindicator,
            choropleth_method: payload.payload.data.choropleth_method,
            parents: payload.payload.parents,
            data: payload.payload.data,
            chartConfiguration: payload.payload.data.chartConfiguration,
            indicatorId: payload.indicatorId
        }
        payload.state.subindicator = subindicator;
        payload.state.selectedSubindicator = payload.payload.selectedSubindicator;
        mapcontrol.displayChoropleth(payload.payload.data.child_data, payload.payload.data.metadata.primary_group, payload.payload.data.choropleth_method, payload.payload.selectedSubindicator)
        mapchip.onSubIndicatorChange(payload.payload);
    })

    controller.on('redraw', payload => {
        controller.handleNewProfileChoropleth()
    })
}

function loadAndDisplayChoropleth(payload, mapcontrol, showMapchip = false, childData = null) {
    const geo = payload.state.profile.geometries.boundary.properties.code;
    const ps = payload.state;
    const method = ps.subindicator.choropleth_method;
    const indicatorTitle = payload.payload.indicatorTitle;
    const selectedSubindicator = ps.selectedSubindicator;
    const filter = ps.subindicator.filter;
    let data = ps.subindicator.data
    if (childData) data.child_data = childData;
    mapcontrol.handleChoropleth(data, method, selectedSubindicator, indicatorTitle, showMapchip, filter);
}
