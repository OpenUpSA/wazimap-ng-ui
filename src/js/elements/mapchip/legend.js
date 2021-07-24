import {Component} from "../../utils";

export class Legend extends Component {
    constructor(parent, container, legendColors) {
        super(parent);

        this._legendColors = legendColors;
        this.prepareDomElements(container);
    }

    get container() {
        return this._container;
    }

    prepareDomElements(container) {
        const legendBlock = $('.map_legend-block')[0];
        this._container = container;
        this._clonedLegendBlock = legendBlock.cloneNode(true);
        this._clonedLegend = $('.map-options__legend')[0].cloneNode(true);
    }

    show(colors, intervalLabels, lightStart = 3) {
        if (colors.length != intervalLabels.length)
            throw 'Expected the number of intervals to be the same as the number of colours.'

        this.container.html('');

        for (let i = 0; i < intervalLabels.length; i++) {
            const interval = intervalLabels[i];
            const item = this.clonedLegendBlock.cloneNode(true);
            const label = interval;
          
            if (i >= lightStart) {
                $(item).addClass('light');
            }

            $('.truncate', item).text(intervalLabels[i]);
            $(item).css('background-color', colors[i]);
            $(item).css('opacity', this._legendColors.opacity);
            this.container.append(item);
        }
    }
}