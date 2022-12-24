import {VersionController} from "../versions/version_controller";

export function configureProfileEvents(controller, objs = {profileLoader: null}) {
    const profileLoader = objs['profileLoader'];

    controller.on(VersionController.EVENTS.ready, payload => {
        profileLoader.filteredIndicators = controller.filteredIndicators;
        profileLoader.loadProfile(payload.payload, controller.versionController.activeVersion)
    });
    controller.on(VersionController.EVENTS.ready, () => {
        profileLoader.updateActiveVersion(controller.versionController.activeVersion)
    });
    controller.on(VersionController.EVENTS.updated, () => {
        profileLoader.updateActiveVersion(controller.versionController.activeVersion)
    });
    controller.bubbleEvents(profileLoader, [
        'profile.chart.saveAsPng', 'profile.chart.valueTypeChanged',
        'profile.chart.download_csv', 'profile.chart.download_excel', 'profile.chart.download_json', 'profile.chart.download_kml',
        'point_tray.subindicator_filter.filter'
    ]);

    controller.on('hashChange', () => {
        if (profileLoader.profileHeader !== null) {
            profileLoader.profileHeader.facilityController.isLoading = true;
        }
    })
    controller.on(VersionController.EVENTS.updated, () => {
        profileLoader.profileHeader.facilityController.isLoading = true;
        profileLoader.profileHeader.facilityController.getAndAddFacilities(controller.versionController.activeVersion);
    });

    profileLoader.on('profile.chart.filtered', payload => {
        controller.onChartFiltered(payload);
    });

    controller.on('profile.chart.filtersUpdated', payload => {
        for (const category of profileLoader.categories) {
            for (const subCategory of category.subCategories) {
                for (const indicator of subCategory.indicators) {
                    if (indicator.indicator.id === payload.payload.indicatorId) {
                        indicator.chart.filterController.filtersUpdatedInMyView(payload.payload);
                        break;
                    }
                }
            }
        }
    })
}
