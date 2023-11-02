import {VersionController} from "../versions/version_controller";
import {SidePanels} from "../elements/side_panels";

export function configureProfileEvents(controller, objs = {profileLoader: null}) {
    const profileLoader = objs['profileLoader'];

    controller.on(VersionController.EVENTS.ready, payload => {
        profileLoader.filteredIndicators = controller.filteredIndicators;
        profileLoader.siteWideFilters = controller.siteWideFilters;
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
        profileLoader.hiddenIndicators = controller.hiddenIndicators;
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
                        indicator.chart.filterController.filtersUpdatedInMyView(payload.payload, SidePanels.PANELS.richData);
                        break;
                    }
                }
            }
        }
    })

    profileLoader.on('filterRow.created.new', payload => {
        payload.filterController.setFilterRowState(payload.filterRow, controller.siteWideFilters);
    })

    profileLoader.on('filterRow.filter.unlocked', payload => {
        controller.removeSiteWideFilter(payload.currentIndicatorValue, payload.currentSubIndicatorValue);
    })

    profileLoader.on('filterRow.filter.locked', payload => {
        controller.addSiteWideFilter(payload.currentIndicatorValue, payload.currentSubIndicatorValue);
    })

    controller.on('my_view.siteWideFilters.updated', payload => {
        let allIndicators = [];
        for (const category of profileLoader.categories) {
            for (const subCategory of category.subCategories) {
                for (const indicator of subCategory.indicators) {
                    // do not block the UI thread
                    allIndicators.push(indicator);
                }
            }
        }

        allIndicators.forEach((indicator, index) => {
            setTimeout(() => {
                let payloadClone = structuredClone(payload);
                const siteWideFilters = payloadClone.payload.siteWideFilters;
                const chart = indicator.chart;
                payloadClone.payload['indicatorId'] = indicator.indicator.id;

                if (chart !== null && chart !== undefined) {
                    chart.filterController.model.dataFilterModel.siteWideFilters = siteWideFilters;
                    chart.filterController.siteWideFiltersUpdatedInMyView(payloadClone.payload, SidePanels.PANELS.richData);
                }

                if (index === allIndicators.length - 1) {
                    // last one
                    chart.filterController.triggerEvent('filterRow.all.updated');
                }
            }, 0)
        })
    })

    controller.on('my_view.hiddenIndicators.updated', payload => {
      for (const category of profileLoader.categories) {
          for (const subCategory of category.subCategories) {
              for (const indicator of subCategory.indicators) {
                  if (indicator.indicator.id === payload.payload.indicatorId) {
                      indicator.isVisible = payload.payload.action !== "add";
                      break;
                  }
              }
          }
      }
    })

    controller.on('my_view.hiddenIndicatorsPanel.reload', payload => {
        profileLoader.hiddenIndicators = payload.payload;
        for (const category of profileLoader.categories) {
            for (const subCategory of category.subCategories) {
                for (const indicator of subCategory.indicators) {
                  indicator.isVisible = !payload.payload.includes(indicator.indicator.id);
                }
            }
        }
    })
}
