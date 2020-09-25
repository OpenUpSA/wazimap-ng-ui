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
        const pp = payload.payload;
        const ps = payload.state;
        mapcontrol.displayChoropleth(pp.data, pp.subindicatorArr, ps.subindicator.choropleth_method);
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
            mapcontrol.displayChoropleth(pp.data, pp.subindicatorArr, ps.subindicator.choropleth_method);

            if (typeof pp.indicators !== 'undefined') {
                //indicators changed -- trigger onSubIndicatorChange
                const args = {
                    indicators: pp.indicators,
                    subindicatorKey: ps.selectedSubindicator,
                    indicatorTitle: ps.subindicator.indicatorTitle,
                    filter: ps.subindicator.filter
                }

                mapchip.onSubIndicatorChange(args);
            }
        }, 0);
    })

    controller.on('map.choropleth.display', payload => mapchip.onChoropleth(payload.payload));
    controller.on('map_explorer.subindicator.click', payload => {
        const ps = payload.state;
        const method = ps.subindicator.choropleth_method;
        mapcontrol.handleChoropleth(ps.subindicator, method)
    })

    controller.on('map_explorer.subindicator.click', payload => {
        const pp = payload.payload;
        const args = {
            indicators: pp.indicators,
            subindicatorKey: pp.obj.keys,
            indicatorTitle: pp.indicatorTitle
        }

        mapchip.onSubIndicatorChange(args);
    });

}
