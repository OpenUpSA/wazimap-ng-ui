import {Observable, getJSON} from './utils';
import {Profile} from './profile';

export class GeographyLoader extends Observable {
    constructor(baseUrl, map) {
        super();
        this.baseUrl = baseUrl;
        this.map = map;
    }

    loadGeography(geography, profileId=1) {
        const url = `${this.baseUrl}/profiles/${profileId}/geographies/${geography}/`;
        const self = this;

        this.triggerEvent('loadingGeography', {geography: geography, profile: profileId});
        return getJSON(url).then(data => {
            const profile = new Profile(data);

            // TODO need to move this somewhere useful
            $(".d3-tip").css("z-index", 100);

            self.triggerEvent('loadedGeography', {geography: geography, profile: profile});
            self.map.overlayBoundaries(geography);
        })
    } 
}