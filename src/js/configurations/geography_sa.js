import {schemeBlues as d3schemeBlues} from 'd3-scale-chromatic';
import {RICH_DATA_PANEL, POINT_DATA_PANEL, DATA_EXPLORER_PANEL, NO_PANELS} from '../elements/side_panels';

export class Config {

    constructor() {
        this.config = {}
    }

    setConfig(config) {
        this.config = config;
    }

    get profileId() {
        if (this.config.profileId != undefined)
            return this.config.profileId;
        return 1;
    }

    get defaultPanel() {
        if (this.config["default_panel"] != undefined)
            return this.config["default_panel"];
        return NO_PANELS;
    }

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
            choropleth: this.choropleth,
            leafletOptions: this.leafletOptions,
            layerStyles: this.layerStyles
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
                url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}.png',
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

    get choropleth() {
        return {
            colors: d3schemeBlues[5],
            opacity: 0.7,
            opacity_over: 0.8
        }
    }

    get mapColors() {
        return {
            main: {
                fill: "#cccccc",
                hover: "#3BAD84"
            },
            secondary: {
                fill: "#ffffff",
                hover: "#3BAD84"
            }
        }
    }

    get layerStyles() {
        const colors = this.mapColors;

        let color_config = {}
        if (this.config["layer_styles"] != undefined)
            color_config = this.config["layer_styles"];

        const default_color_config = {
            hoverOnly: {
                over: {
                    fillColor: colors.secondary.hover,
                    fillOpacity: 0.5,
                },
                out: {
                    fillColor: colors.secondary.fill,
                    stroke: false,
                }
            },
            selected: {
                over: {
                    color: "#666666",
                    fillColor: colors.main.hover,
                    fillOpacity: 0.6,
                },
                out: {
                    color: "#666666",
                    fillColor: colors.main.fill,

                    opacity: 0.5,
                    fillOpacity: 0.5,

                    weight: 1,
                }
            }
        }

        return {...default_color_config, ...color_config}
    }
}
