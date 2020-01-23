import {Observable, getJSON} from './utils';
import {Profile} from './profile';

const breadcrumbsContainer = $('.map__location-tags_wrapper');
const breadcrumbTemplate = $('.breadcrumb--map', breadcrumbsContainer)[0];
export class LocationInfoBox extends Observable {
    constructor() {
        super();
    }

    updateInfo(locations) {
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