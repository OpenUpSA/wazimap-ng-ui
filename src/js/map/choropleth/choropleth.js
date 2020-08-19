import {scaleSequential as d3scaleSequential} from 'd3-scale';
import {min as d3min, max as d3max} from 'd3-array';

import {Observable} from '../../utils';
import {SubindicatorCalculator} from './subindicator_calculator';
import {SiblingCalculator} from './sibling_calculator';
import {AbsoluteValueCalculator} from './absolute_value_calculator';

export class Choropleth extends Observable {
    constructor(layers, layerStyler, options, buffer = 0.1) {
        super();

        this.layers = layers;
        this.layerStyler = layerStyler;
        this.legendColors = options.colors;
        this.options = options;
        this.buffer = buffer;
        this.currentLayers = [];
    }

    getCalculator(method) {
        let calculationFunc = {
            subindicator: SubindicatorCalculator,
            sibling: SiblingCalculator,
            absolute_value: AbsoluteValueCalculator,
        }[method];


        if (calculationFunc == undefined)
            calculationFunc = SubindicatorCalculator

        return calculationFunc;

    }

    getIntervals(values) {
        const bounds = this.getBounds(values);
        const numIntervals = this.legendColors.length;
        const domain = [...Array(numIntervals).keys()]
        const scale = d3scaleSequential()
            .domain([0, numIntervals - 1])
            .range([bounds.lower, bounds.upper])

        const intervals = domain.map(idx => scale(idx))

        return intervals
    }

    reset(setLayerToSelected) {
        const self = this;
        this.currentLayers.forEach(code => {
            //setLayerToSelected -> removemapchip
            //setLayerToHoverOnly -> display
            const layer = self.layers[code];
            if (setLayerToSelected) {
                self.layerStyler.setLayerToSelected(layer);
            }
        })

        this.currentLayers = [];

        this.triggerEvent('map.choropleth.reset', null);
    }

    getBounds(values) {
        const lowest = (1 - this.buffer) * d3min(values) < 0 ? 0 : (1 - this.buffer) * d3min(values);
        const highest = (1 + this.buffer) * d3max(values) > 1 ? 1 : (1 + this.buffer) * d3max(values);

        return {
            lower: lowest,
            upper: highest
        }
    }

    showChoropleth(calculations, setLayerToSelected) {
        const self = this;
        const childGeographyValues = [...calculations];
        const values = childGeographyValues.map(el => el.val);
        const bounds = this.getBounds(values);
        const numIntervals = this.legendColors.length;

        const scale = d3scaleSequential()
            .domain([bounds.lower, bounds.upper])
            .range([this.legendColors[0], this.legendColors[numIntervals - 1]]);

        // this.reset(setLayerToSelected);

        childGeographyValues.forEach(el => {
            const layer = self.layers[el.code];
            self.currentLayers.push(el.code);
            if (layer != undefined) {
                const color = scale(el.val);
                self.layerStyler.setLayerStyle(layer, {
                    over: {fillColor: color, fillOpacity: self.options.opacity_over},
                    out: {fillColor: color, fillOpacity: self.options.opacity},
                })
                layer.feature.properties.percentage = el.val;
            }
        })
    }
}
