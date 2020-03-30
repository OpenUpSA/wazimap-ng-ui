import {Observable} from '../utils';
import {interpolateBlues as d3interpolateBlues} from 'd3-scale-chromatic';
import {scaleSequential as d3scaleSequential, scaleLinear} from 'd3-scale';
import {min as d3min, max as d3max} from 'd3-array';

const legendCount = 5;

/**
 * this class manages choropleth
 */
export class Choropleth extends Observable {
    constructor(_subindicator, _layerCache, _legendColors) {
        super();

        this.legendColors = _legendColors;
        this.subindicator = _subindicator;
        this.layerCache = _layerCache;
        this.childCodes = Object.keys(_subindicator.obj.children);
    }

    resetLayers = (scale) => {
        let self = this;

        this.childCodes.forEach(childCode => {
            const layer = self.layerCache[childCode];
            const color = scale(0);
            if (layer != undefined)
                layer.setStyle({fillColor: color});
        });
    }

    getChildGeographyValues = (type) => {
        let result = null;

        switch (type) {
            case 1:
                result = this.getGeographyBasedValues();
                break;
            case 2:
                result = this.getLevelBasedValues();
                break;
        }

        return result;
    }

    getGeographyBasedValues = () => {
        let result = Object.entries(this.subindicator.obj.children).map(childGeography => {
            const code = childGeography[0];
            const count = childGeography[1];
            const universe = this.subindicator.subindicators.reduce((el1, el2) => {
                if (el2.children != undefined && el2.children[code] != undefined)
                    return el1 + el2.children[code];
            }, 0)
            const val = count / universe;
            return {code: code, val: val};
        })

        return result;
    }

    getLevelBasedValues = () => {
        let result = Object.entries(this.subindicator.obj.children).map(childGeography => {
            const code = childGeography[0];
            const count = childGeography[1];
            let universe = 0;
            Object.entries(this.subindicator.obj.children).map(c => {
                universe += c[1];
            })

            const val = count / universe;
            return {code: code, val: val};
        })

        return result;
    }

    getLegendColors = (legendPercentages, values, scale) => {
        let tick = (d3max(values) * 1.1 - d3min(values) * 0.9) / (legendCount - 1);
        let startPoint = d3min(values) * 0.9;
        for (let i = 1; i <= legendCount; i++) {
            let percentage = 0;
            if ((((i - 1) * tick + startPoint) * 100) > 100) {
                percentage = 100;
                i = legendCount;
            } else {
                percentage = (((i - 1) * tick + startPoint) * 100).toFixed(1);
            }
            this.legendColors.push({
                percentage: percentage,
                fillColor: scale(legendPercentages(i))
            });
        }
    }

    showChoropleth = (type) => {
        let self = this;
        const childGeographyValues = this.getChildGeographyValues(type);

        const values = childGeographyValues.map(el => el.val);
        const scale = d3scaleSequential(d3interpolateBlues).domain([d3min(values) * 0.9, d3max(values) * 1.1]);

        let legendPercentages = scaleLinear()
            .domain([1, legendCount])
            .nice()
            .range([d3min(values) * 0.9, d3max(values) * 1.1]);

        this.getLegendColors(legendPercentages, values, scale);
        this.resetLayers(scale);

        childGeographyValues.forEach((el) => {
            const layer = self.layerCache[el.code];
            if (layer != undefined) {
                const color = scale(el.val);
                layer.setStyle({fillColor: color});
                layer.feature.properties.percentage = el.val;
            }
        })
    }
}
