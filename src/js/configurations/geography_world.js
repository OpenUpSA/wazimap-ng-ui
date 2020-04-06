import {Config as ConfigSA} from './geography_sa';

export class Config extends ConfigSA {
    get rootGeography() {
        return "WORLD";
    }

    get preferredChildren() {
        return {
            world: ['country']
        }        
    }

    get defaultCoordinates() {
        return {'lat': -26.0123951, 'long': 27.0061074, 'zoom': 10}
    }
}