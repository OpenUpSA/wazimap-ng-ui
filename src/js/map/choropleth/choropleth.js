import {scaleSequential as d3scaleSequential} from 'd3-scale';
import {max as d3max, min as d3min} from 'd3-array';

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
        this.options = options;
        this.buffer = buffer;
        this.currentLayers = [];
        this._choroplethRangeType = choroplethRangeTypes.BY_SUBINDICATOR;
    }

    get choroplethRangeType() {
        return this._choroplethRangeType;
    }

    set choroplethRangeType(value) {
        if (value === undefined) {
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
        const numIntervalCount = 5; //hardcoded for now
        const domain = [...Array(numIntervalCount).keys()]

        const numbersScale = this.getScale([0, numIntervalCount - 1], [bounds.lower, bounds.upper]);

        return domain.map(idx => numbersScale(idx));
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
        const hasNegative = values.some(v => v < 0);
        const hasPositive = values.some(v => v > 0);

        if (hasNegative && hasPositive) {
            const maxScaleValue = Math.max(...values.map(v => Math.abs(v)));
            return {
                "lower": maxScaleValue * -1,
                "upper": maxScaleValue
            }
        }

        return {
            lower: d3min(values),
            upper: d3max(values)
        }
    }

    getColorRange(values, positiveRangeRequested = true) {
        const hasNegative = values.some(v => v < 0);
        const hasPositive = values.some(v => v > 0);

        let positiveColorRange = this.options.positive_color_range;
        let negativeColorRange = this.options.negative_color_range;
        let zeroColor = this.options.zero_color;

        if (hasPositive && !hasNegative) {
            // only positive
            return {
                start: positiveColorRange[0],
                end: positiveColorRange[1]
            };
        } else if (!hasPositive && hasNegative) {
            // only negative
            return {
                start: negativeColorRange[0],
                end: negativeColorRange[1]
            };
        } else if (hasPositive && hasNegative) {
            // both
            if (positiveRangeRequested) {
                return {
                    start: zeroColor,
                    end: positiveColorRange[1]
                };
            } else {
                return {
                    start: negativeColorRange[0],
                    end: zeroColor
                };
            }
        }
    }

    getScale(domain, range) {
        return d3scaleSequential()
            .domain([domain[0], domain[1]])
            .range([range[0], range[1]]);
    }

    showChoropleth(calculations) {
        this.reset(true);
        const self = this;
        const childGeographyValues = [...calculations];

        childGeographyValues.forEach(el => {
            const layer = self.layers[el.code];
            if (layer !== undefined) {
                self.currentLayers.push(el.code);
                self.layerStyler.setLayerStyle(layer, {
                    over: {fillColor: el.color, fillOpacity: self.options.opacity_over},
                    out: {fillColor: el.color, fillOpacity: self.options.opacity},
                })
                if (typeof layer.feature !== 'undefined') {
                    layer.feature.properties.percentage = el.val;
                }
            }
        })
    }
}
