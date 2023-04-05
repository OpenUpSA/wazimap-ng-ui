import {schemeBlues as d3schemeBlues} from 'd3-scale-chromatic';
import {Version} from "../versions/version";
import {SidePanels} from "../elements/side_panels";

export class Config {

    constructor() {
        this.config = {};
        this.versions = [];
        this._viewName = null;
    }

    setConfig(config) {
        this.config = config;
        this.setView();
    }

    setView() {
        const urlParams = new URLSearchParams(window.location.search);
        this._viewName = urlParams.get('view');
    }

    setVersions(geography_hierarchy) {
        if (geography_hierarchy.configuration !== undefined) {
            const defaultVersion = geography_hierarchy.configuration.default_version;
            const versions = geography_hierarchy.configuration.versions;

            versions.forEach((v) => {
                this.versions.push(new Version(v, v === defaultVersion))
            })
        }
    }

    get style() {
        if (this.config.style == undefined)
            return {}
        return this.config.style
    }

    get profileId() {
        if (this.config.profileId != undefined)
            return this.config.profileId;
        return 1;
    }

    get defaultPanel() {
        if (this.config["default_panel"] != undefined)
            return this.config["default_panel"];
        return SidePanels.PANELS.noPanels;
    }

    get watermarkEnabled() {
        if (this.config["watermark_enabled"] != undefined)
            return this.config["watermark_enabled"];
        return true;
    }

    get siteWideFiltersEnabled() {
        if (this.config["site_wide_filters_enabled"] != undefined)
            return this.config["site_wide_filters_enabled"];
        return false;
    }

    get defaultFilters() {
        let globalConfig = [];
        let viewConfig = [];
        let mergedConfig = [];

        viewConfig = this.getViewConfig('default_filters') || [];

        if (this.config["default_filters"] !== undefined) {
            globalConfig = this.config["default_filters"];
        }

        mergedConfig = globalConfig.filter(x => !viewConfig.find(y => x['name'] === y['name']));
        mergedConfig = mergedConfig.concat(viewConfig);

        return mergedConfig;
    }

    get restrictValues() {
        let globalConfig = {};
        let viewConfig = {};
        let mergedConfig = {};

        viewConfig = this.getViewConfig('restrict_values') || {};

        if (this.config["restrict_values"] !== undefined) {
            globalConfig = this.config["restrict_values"];
        }

        Object.assign(mergedConfig, globalConfig, viewConfig);

        return mergedConfig;
    }

    getViewConfig(filterType) {
        if (
            this.views[this._viewName] !== undefined
            && this.views[this._viewName][filterType] !== undefined
        ) {
            return this.views[this._viewName][filterType];
        }
        return null;
    }

    get views() {
        if (this.config["views"] != undefined)
            return this.config["views"];
        return {};
    }

    panelEnabled(panel) {
        if (this.config.panels != undefined && this.config.panels[panel] != undefined && this.config.panels[panel]['visible'] != undefined)
            return this.config.panels[panel]['visible']

        return true;
    }

    get rootGeography() {
        if (this.config["root_geography"] != undefined)
            return this.config["root_geography"];
        return "ZA";
    }

    get preferredChildren() {
        let config = {}
        if (this.config["preferred_children"] != undefined)
            config = this.config["preferred_children"]

        const defaultConfig = {
            country: ['province'],
            province: ['district', 'municipality'],
            district: ['municipality'],
            municipality: ['mainplace', 'planning_region', 'ward'],
            mainplace: ['subplace']
        }

        return {...defaultConfig, ...config}
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
        let config = {}
        if (this.config["leaflet_options"] != undefined)
            config = this.config["leaflet_options"];

        const defaultConfig = {
            zoomControl: false,
            preferCanvas: true,
            attributionControl: true
        }

        return {...defaultConfig, ...config}
    }

    get defaultCoordinates() {
        let config = {}
        if (this.config["default_coordinates"] != undefined)
            config = this.config["default_coordinates"]

        const defaultConfig = {'lat': -28.995409163308832, 'long': 25.093833387362697, 'zoom': 6}

        return {...defaultConfig, ...config}
    }

    get tileLayers() {
        let config = {}
        if (this.config["tile_layers"] != undefined)
            return this.config["tile_layers"];

        const defaultConfig = [
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

        return defaultConfig
    }

    get choropleth() {
        let config = {}
        if (this.config["choropleth"] != undefined)
            config = this.config["choropleth"];

        const defaultConfig = {
            colors: d3schemeBlues[5],
            positive_color_range: ["#eff3ff", "#08519c"],
            negative_color_range: ["#b30000", "#fef0d9"],
            zero_color: '#eeeeee',
            opacity: 0.7,
            opacity_over: 0.8
        }

        return {...defaultConfig, ...config}
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
