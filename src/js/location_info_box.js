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

    update(profile) {
        const geographies = profile.data.geography;
        const currentGeography = {code: geographies.code, level: geographies.level, name: geographies.name}
        const locations = [...geographies.parents, currentGeography]

        this.updateBreadcrumbs(locations);
        this.updateHighlights(profile.data);
    }

    updateHighlights(data) {
        const highlights = data.highlights;
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

    updateBreadcrumbs(locations) {
        const self = this;
        $('.breadcrumb--map', breadcrumbsContainer).remove();

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
            $(locationElement).off("click")
        }

    }
}