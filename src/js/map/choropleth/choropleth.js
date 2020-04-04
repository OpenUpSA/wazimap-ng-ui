import {Observable} from '../../utils';
import {scaleSequential as d3scaleSequential} from 'd3-scale';
import {min as d3min, max as d3max} from 'd3-array';

export class Choropleth {
    constructor(layers, layerStyler, legendColors, buffer=0.1) {
        this.layers = layers;
        this.layerStyler = layerStyler;
        this.legendColors = legendColors
        this.buffer = buffer;
        this.currentLayers = [];
    }

    getIntervals(values) {
        const bounds = this.getBounds(values);
        const numIntervals = this.legendColors.length;
        const domain = [...Array(numIntervals).keys()]
        const scale = d3scaleSequential()
            .domain(domain)
            .range([bounds.lower, bounds.upper])

        const intervals = domain.map(idx => scale(idx))

        return intervals
    }

    reset() {
        const self = this;
        this.currentLayers.forEach(layer => {
            self.layerStyler.setLayerToSelected(layer);
        })

        this.currentLayers = [];

    }

    getBounds(values) {
        return {
            lower: (1 - this.buffer) * d3min(values),
            upper: (1 + this.buffer) * d3max(values)
        }
    }

    showChoropleth(calculations) {
        const self = this;
        const childGeographyValues = [...calculations];
        const values = childGeographyValues.map(el => el.val);
        const bounds = this.getBounds(values);

        const scale = d3scaleSequential()
            .domain([bounds.lower, bounds.upper])
            .range(this.legendColors);

        this.reset();

        childGeographyValues.forEach(el => {
            const layer = self.layers[el.code];
            self.currentLayers.push(layer);
            if (layer != undefined) {
                const color = scale(el.val);
                layer.setStyle({fillColor: color});
                layer.setStyle({fillOpacity: 0.8});
                layer.feature.properties.percentage = el.val;
            }
        })

    }
}
