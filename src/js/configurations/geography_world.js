import {Config as ConfigSA} from './geography_sa';

export class Config extends ConfigSA {
    get rootGeography() {
        return "WORLD";
    }

    get preferredChildren() {
        return {
            world: ['country'],
            country: ['province', 'district'], # district is used in Lesotho
            province: ['district', 'municipality', 'community council'], # community council is used in Lesotho
            district: ['municipality']
        }        
    }

    get defaultCoordinates() {
        return {'lat': -26.0123951, 'long': 27.0061074, 'zoom': 10}
    }
}