import {format as d3format} from 'd3-format';

import {Component} from "../../utils";

export class Legend extends Component {
    constructor(container, legendColors) {
        super();

        this.lightStart = 3;

        this.prepareDomElements(container);
        this.legendColors = legendColors;
    }

    prepareDomElements(container) {
        const legendBlock = $('.map_legend-block')[0];
        this.legendContainer = container;
        this.clonedLegendBlock = legendBlock.cloneNode(true);	//a legend block
        this.clonedLegend = $('.map-options__legend')[0].cloneNode(true);	//the legend itself

        this.clear();
    }

    clear() {

    }

    show(colors, intervals) {
        if (colors.length != intervals.length)
            throw 'Expected the number of intervals to be the same as the number of colours.'

        const legend = $(this.clonedLegend);
        const fmt = d3format(".1%")

        this.legendContainer.html('');

        for (let i = 0; i < intervals.length; i++) {
            const interval = intervals[i];
            const item = this.clonedLegendBlock.cloneNode(true);
            const label = interval;

            if (i >= this.lightStart) {
                $(item).addClass('light');
            }

            $('.truncate', item).text(label);
            $(item).css('background-color', colors[i]);
            $(item).css('opacity', this.legendColors.opacity);
            this.legendContainer.append(item);
        }
    }
}