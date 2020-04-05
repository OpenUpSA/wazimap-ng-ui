import {schemeBlues as d3schemeBlues} from 'd3-scale-chromatic';

export class Config {
    get rootGeography() {
        return "ZA";
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

    get geoViewTypes() {
        return {
            mainplace: ['mainplace', 'subplace'],
            ward: ['ward']
        }
        
    }

    get geographyLevels() {
        return {
            country: 'Country',
            province: 'Province',
            district: 'District',
            municipality: 'Municipality',
            mainplace: 'Mainplace',
            subplace: 'Subplace',
            ward: 'Ward'
        }
    }

    get map() {
        return {
            defaultCoordinates: this.defaultCoordinates,
            tileLayers: this.tileLayers,
            zoomEnabled: false,
            zoomPosition: 'bottomright',
            limitGeoViewSelections: true, // TODO temporary until specific geographies are factored out of the code
            choroplethColors: this.choroplethColors,
            leafletOptions: this.leafletOptions
        }
    }

    get leafletOptions() {
        return {
            zoomControl: false,
            preferCanvas: true
        } 
    }

    get defaultCoordinates() {
        return {'lat': -28.995409163308832, 'long': 25.093833387362697, 'zoom': 6}
    }

    get tileLayers() {
        return  [
            {
                url: 'http://a.tiles.wmflabs.org/osm-no-labels/{z}/{x}/{y}.png',
                pane: 'tilePane',
                zIndex: 200
            },
            {
                url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}.png',
                pane: 'labelsPanel',
                zIndex: 650
            }
        ]
    }

    get tileUrl() {
        //return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        return 'https://a.tiles.wmflabs.org/osm-no-labels/{z}/{x}/{y}.png'
    }

    get choroplethColors() {
        return d3schemeBlues[5]
    }
}
