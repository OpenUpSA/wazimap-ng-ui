import {Component, isColorLight} from "../../utils";

export class Legend extends Component {
    constructor(parent, container, legendColors) {
        super(parent);

        this._legendColors = legendColors;
        this._isLoading = false;

        this.prepareDomElements(container);
    }

    get container() {
        return this._container;
    }

    set isLoading(value) {
        if (value) {
            $(this.container).find('.map-options__legend_loading').removeClass('hidden');
        } else {
            $(this.container).find('.map-options__legend_loading').addClass('hidden');
        }
        $(this.container).find('.map_legend-block').remove();

        this._isLoading = value;
    }

    prepareDomElements(container) {
        const legendBlock = $('.map_legend-block')[0];
        this._container = container;
        this._clonedLegendBlock = legendBlock.cloneNode(true);
        this._clonedLegend = $('.map-options__legend')[0].cloneNode(true);
    }

    show(colors, intervalLabels) {
        if (colors.length !== intervalLabels.length)
            throw 'Expected the number of intervals to be the same as the number of colours.'

        this.isLoading = false;

        for (let i = 0; i < intervalLabels.length; i++) {
            const interval = intervalLabels[i];
            const item = this._clonedLegendBlock.cloneNode(true);

            if (!isColorLight(colors[i])) {
                $(item).addClass('light');
            }

            $('.truncate', item).text(intervalLabels[i]);
            $(item).css('background-color', colors[i]);
            $(item).css('opacity', this._legendColors.opacity);
            this.container.append(item);
        }
    }
}