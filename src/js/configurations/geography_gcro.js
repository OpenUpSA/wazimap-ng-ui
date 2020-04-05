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

    get defaultCoordinates() {
        return {'lat': -26.0123951, 'long': 27.0061074, 'zoom': 10}
    }
}