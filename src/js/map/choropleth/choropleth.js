import {scaleSequential as d3scaleSequential} from 'd3-scale';
import {min as d3min, max as d3max} from 'd3-array';

import {Component} from '../../utils';
import SubindicatorCalculator from './subindicator_calculator';
import SiblingCalculator from './sibling_calculator';
import AbsoluteValueCalculator from './absolute_value_calculator';

const choroplethRangeTypes = {
    BY_SUBINDICATOR: "by_subindicator",
    BY_INDICATOR: 'by_indicator'
}

export class Choropleth extends Component {
    constructor(parent, layers, layerStyler, options, buffer = 0.1) {
        super(parent);

        this.layers = layers;
        this.layerStyler = layerStyler;
        this.legendColors = options.colors;
        this.options = options;
        this.buffer = buffer;
        this.currentLayers = [];
        this._choroplethRangeType = choroplethRangeTypes.BY_SUBINDICATOR;
    }

    get choroplethRangeType() {
        return this._choroplethRangeType;
    }

    set choroplethRangeType(value) {
        if (value === undefined){
            return;
        }
        this._choroplethRangeType = value;
    }

    getCalculator(method) {
        let calculator = {
            subindicator: new SubindicatorCalculator(),
            sibling: new SiblingCalculator(),
            absolute_value: new AbsoluteValueCalculator(),
        }[method];

        if (calculator === undefined)
            calculator = SubindicatorCalculator

        return calculator;
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

    getChoroplethValues(calculator, childData, primaryGroup, selectedSubindicator, allSubindicators) {
        let values = [];
        let calculation;
        calculation = calculator.calculate(childData, primaryGroup, selectedSubindicator);
        if (this.choroplethRangeType === choroplethRangeTypes.BY_SUBINDICATOR) {
            values = calculation.map(el => el.val);
        } else if (this.choroplethRangeType === choroplethRangeTypes.BY_INDICATOR) {
            allSubindicators.forEach((si) => {
                let tempCalculation = calculator.calculate(childData, primaryGroup, si);
                let tempValues = tempCalculation.map(el => el.val);
                values.push(...tempValues);
            })
        }

        return {values, calculation};
    }

    getBounds(values) {
        return {
            lower: d3min(values),
            upper: d3max(values)
        }
    }

    showChoropleth(calculations, values) {
        this.reset(true);
        const self = this;
        const childGeographyValues = [...calculations];
        const bounds = this.getBounds(values);
        const numIntervals = this.legendColors.length;

        const scale = d3scaleSequential()
            .domain([bounds.lower, bounds.upper])
            .range([this.legendColors[0], this.legendColors[numIntervals - 1]]);

        childGeographyValues.forEach(el => {
            const layer = self.layers[el.code];
            if (layer !== undefined) {
                self.currentLayers.push(el.code);
                const color = scale(el.val);
                self.layerStyler.setLayerStyle(layer, {
                    over: {fillColor: color, fillOpacity: self.options.opacity_over},
                    out: {fillColor: color, fillOpacity: self.options.opacity},
                })
                if (typeof layer.feature !== 'undefined') {
                    layer.feature.properties.percentage = el.val;
                }
            }
        })
    }
}
