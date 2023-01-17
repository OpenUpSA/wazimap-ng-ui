import {VersionController} from "../versions/version_controller";
import {SidePanels} from "../elements/side_panels";

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

    controller.on('map.choropleth.loaded', args => {
        if (!args.payload.showMapchip) {
            return;
        }

        let previouslySelectedFilters = controller.filteredIndicators.filter(x => x.indicatorId === args.state.subindicator.indicatorId
            && x.filters.filter(y => y.appliesTo.indexOf(SidePanels.PANELS.dataMapper) >= 0).length > 0);

        let previouslySelectedFiltersClone = structuredClone(previouslySelectedFilters);

        previouslySelectedFiltersClone.forEach(x => {
            x.filters = x.filters.filter(x => x.appliesTo.indexOf(SidePanels.PANELS.dataMapper) >= 0);
        });

        const metadata = args.payload.metadata;
        const params = {
            metadata: metadata,
            indicatorTitle: args.payload.indicatorTitle,
            selectedSubindicator: args.payload.selectedSubindicator,
            childData: args.payload.data,
            filter: previouslySelectedFiltersClone,
            config: args.payload.config,
            method: args.state.subindicator.choropleth_method,
            currentGeo: args.state.profile.geometries.boundary.properties.name,
            siteWideFilters: controller.siteWideFilters
        }
        mapchip.onSubIndicatorChange(params);
    });

    controller.on('redraw', payload => {
        handleNewProfileChoropleth(controller, api, mapcontrol)
    })

    controller.on('my_view.filteredIndicators.removed', payload => {
        controller.removeFilteredIndicator(payload.payload.filteredIndicator, payload.payload.selectedFilter);
    })

    controller.on('mapchip.choropleth.filtersUpdated', payload => {
        mapchip.filterController.filtersUpdatedInMyView(payload.payload, SidePanels.PANELS.dataMapper);
    })

    mapchip.on('filterRow.filter.locked', payload => {
        controller.addSiteWideFilter(payload.currentIndicatorValue, payload.currentSubIndicatorValue);
    })

    mapchip.on('filterRow.filter.unlocked', payload => {
        controller.removeSiteWideFilter(payload.currentIndicatorValue, payload.currentSubIndicatorValue);
    })

    controller.on('my_view.siteWideFilters.updated', payload => {
        if (mapchip.filterController == null) {
            return;
        }

        let payloadClone = structuredClone(payload);
        payloadClone.payload['indicatorId'] = controller.state.subindicator.indicatorId;

        mapchip.filterController.model.dataFilterModel.siteWideFilters = payloadClone.payload.siteWideFilters;
        mapchip.filterController.siteWideFiltersUpdatedInMyView(payloadClone.payload, SidePanels.PANELS.dataMapper);
    })

    mapchip.on('filterRow.created.new', (payload) => {
        payload.filterController.setFilterRowState(payload.filterRow, controller.siteWideFilters);
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
    let data = ps.subindicator.data;
    if (childData) {
        ps.subindicator.data = childData;
        data = childData;
    }

    mapcontrol.handleChoropleth(data, method, selectedSubindicator, indicatorTitle, showMapchip, metadata, config);
}
