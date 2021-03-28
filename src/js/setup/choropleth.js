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
        loadAndDisplayChoropleth(payload, mapcontrol)
    })

    controller.on('newProfileWithChoropleth', payload => {
        setTimeout(() => {
            const pp = payload.payload;
            const ps = payload.state;

            if (typeof pp.data === 'undefined') {
                //no data -- todo : reset choropleth
                mapchip.removeMapChip();
                return;
            }
            loadAndDisplayChoropleth(payload, mapcontrol);

            if (typeof pp.indicators !== 'undefined') {
                //indicators changed -- trigger onSubIndicatorChange
                const args = {
                    indicators: pp.indicators,
                    subindicatorKey: ps.selectedSubindicator,
                    indicatorTitle: ps.subindicator.indicatorTitle,
                    filter: ps.subindicator.filter,
                    children: ps.subindicator.children
                }

                mapchip.onSubIndicatorChange(args);
            }
        }, 0);
    })

    controller.on('map.choropleth.display', payload => mapchip.onChoropleth(payload.payload));
    controller.on('map_explorer.subindicator.click', payload => {
        loadAndDisplayChoropleth(payload, mapcontrol);
    })

    controller.on('map_explorer.subindicator.click', payload => {
        const pp = payload.payload;
        const args = {
            indicators: pp.indicators,
            subindicatorKey: pp.obj.keys,
            indicatorTitle: pp.indicatorTitle,
            children: payload.state.subindicator.children,
            category: pp.parents.category
        }

        console.log({args})

        mapchip.onSubIndicatorChange(args);
    });

    mapcontrol.on('map.choropleth.loaded', payload => {
        console.log('map.choropleth.loaded')
    })

    controller.on('redraw', payload => {
        controller.handleNewProfileChoropleth()
    })
}

function loadAndDisplayChoropleth(payload, mapcontrol) {
    const geo = payload.state.profile.geometries.boundary.properties.code;
    const ps = payload.state;
    const method = ps.subindicator.choropleth_method;
    mapcontrol.loadSubindicatorData(geo)
        .then((data) => {
            mapcontrol.handleChoropleth(data.child_data, data.metadata.primary_group, method, payload.state.selectedSubindicator);
        });
}
