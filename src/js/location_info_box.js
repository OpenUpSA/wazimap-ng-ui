import {Observable, getJSON, numFmt} from './utils';
import {Profile} from './profile';

const container = $('.content__map_location');
const breadcrumbsContainer = $('.map__location-tags_wrapper', container);
const metricContainer = $('.map__location-info_inner', container);

const breadcrumbTemplate = $('.breadcrumb--map', breadcrumbsContainer)[0];
const metricTemplate = $('.map__location-info_metric')[0].cloneNode(true);

const infoContainer = $('.map__location-info', container);

export class LocationInfoBox extends Observable {
    constructor() {
        super();
    }

    update(dataBundle) {
        const profile = dataBundle.profile;
        const locations = [...profile.parents, profile.geography]

        this.updateBreadcrumbs(locations);
        this.updateHighlights(profile.highlights);
    }

    updateHighlights(highlights) {
        const metricContainers = $('.map__location-info_metric').remove()
        let metric = null;
        for (const [name, highlight] of Object.entries(highlights)) {
            metric = metricTemplate.cloneNode(true);
            $('.map__location-info_value', metric).text(numFmt(highlight.count));
            $('.map__location-info_title', metric).text(highlight.label);
            metricContainer.append(metric);
        }

        $(metric).addClass('last');
    }

    updateBreadcrumbs(locations, clear = true) {
        const self = this;
        if (clear) {
            $('.breadcrumb--map', breadcrumbsContainer).remove();
        }

        let locationElement = null;
        locations.forEach(location => {
            locationElement = breadcrumbTemplate.cloneNode(true);
            breadcrumbsContainer.append(locationElement);
            $('.truncate', locationElement).text(location.name);
            $('.breadcrumb__geography-chip div', locationElement).text(location.level);

            $(locationElement).on('click', el => {
                self.triggerEvent('breadcrumbSelected', location);
            })
        })

        if (locationElement != null) {
            $(locationElement).addClass('last')
            $(locationElement).removeClass('hide')
            $(locationElement).off("click")
        }

    }

    updateLocations(locations) {
        this.updateBreadcrumbs(locations, false);
    }
}
