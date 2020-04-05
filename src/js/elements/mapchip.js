import {Observable} from '../utils';
import {map} from "leaflet/dist/leaflet-src.esm";
import {format as d3format} from 'd3-format';

const wrapperClsName = 'content__map_current-display';
const lightStart = 3;

/**
 * Represent the map chip at the bottom of the map
 */
export class MapChip extends Observable {
    constructor(legendColors) {
        super();
        this.legendColors = legendColors;
        this.prepareDomElements();
    }

    prepareDomElements() {
        this.clonedMapChip = $('.chip--map')[0].cloneNode(true);	//chip
        this.clonedLegendBlock = $('.map_legend-block')[0].cloneNode(true);	//a legend block
        this.clonedLegend = $('.content__map_legend')[0].cloneNode(true);	//the legend itself

        $(this.clonedMapChip).removeClass('hide');
        this.clearLegend();
    }

    showMapChip() {
        const element = $(this.clonedMapChip);

        $('.' + wrapperClsName).append(element);	//chip
        element.find('.chip__remove--map').on('click', () => this.removeMapChip());
    }

    showLegend(colors, intervals) {
        if (colors.length != intervals.length)
            throw "Expected the number of intervals to be the same as the number of colours."

        const legend = $(this.clonedLegend);
        const fmt = d3format(".1%")

        $('.' + wrapperClsName).append(legend);	    //legend
        $('.' + wrapperClsName + ' .map_legend-block').remove(); //remove the previous legends

        for (let i = 0; i < intervals.length; i++) {
            const interval = intervals[i];
            const item = this.clonedLegendBlock.cloneNode(true);
            const label = fmt(interval);

            if (i >= lightStart) {
                $(item).addClass('light');
            }

            $('.truncate', item).text(label);
            $(item).css('background-color', colors[i]);
            $(item).css('opacity', this.legendColors.opacity);
            $('.' + wrapperClsName + ' .content__map_legend').append(item);
        }
    }

    updateMapChipText(textValue) {
        $(this.clonedMapChip).find('.truncate').text(textValue);
    }

    clearLegend() {
        $('.' + wrapperClsName).html('');
    }

    removeMapChip() {
        const element = $(this.clonedMapChip);
        this.clearLegend();
        this.triggerEvent('mapChipRemoved', element);
    }

    onChoropleth(payload) {
        this.showLegend(payload.colors, payload.intervals);
    }

    onSubIndicatorChange(payload, colors) {
        const label = `${payload.indicator} (${payload.obj.label})`
        this.updateMapChipText(label);
        this.showMapChip();
    }
}
