import {Observable} from '../../utils';
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
        this.buffer = 0.1;
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

    getLegendColors = (legendPercentages, values, scale) => {
        const lowerBound = 1 - this.buffer;
        const upperBound = 1 + this.buffer;
        const tick = (d3max(values) * upperBound - d3min(values) * lowerBound) / (legendCount - 1);
        const startPoint = d3min(values) * lowerBound;
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

    showChoropleth = (calculations) => {
        const self = this;
        const childGeographyValues = calculations;
        const lowerBound = 1 - this.buffer;
        const upperBound = 1 + this.buffer;

        const values = childGeographyValues.map(el => el.val);
        const scale = d3scaleSequential(d3interpolateBlues)
            .domain([d3min(values) * lowerBound, d3max(values) * upperBound]);

        let legendPercentages = scaleLinear()
            .domain([1, legendCount])
            .nice()
            .range([d3min(values) * lowerBound, d3max(values) * upperBound]);

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
