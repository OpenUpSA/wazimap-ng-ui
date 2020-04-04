import {schemeBlues as d3schemeBlues} from 'd3-scale-chromatic';
import {Config as ConfigSA} from './geography_sa';

export class Config extends ConfigSA {
    get rootGeography() {
        return "GT";
    }

    get preferredChildren() {
        return {
            country: ['province'],
            province: ['district', 'municipality'],
            district: ['municipality'],
            municipality: ['mainplace', 'planning_region', 'ward'],
            mainplace: ['subplace']          
        }        
    }

    get map() {
        return {
            defaultCoordinates: {'lat': -28.995409163308832, 'long': 25.093833387362697, 'zoom': 6},
            tileUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            zoomControlEnabled: false,
            zoomEnabled: false,
            zoomPosition: 'bottomright',
            limitGeoViewSelections: true, // TODO temporary until specific geographies are factored out of the code
            choroplethColors: d3schemeBlues[5]
        }
    }
}