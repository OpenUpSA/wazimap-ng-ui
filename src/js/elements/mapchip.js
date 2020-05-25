import {Observable} from '../utils';
import {format as d3format} from 'd3-format';
import {SubindicatorFilter} from "../profile/subindicator_filter";

const wrapperClsName = 'content__map_current-display';
const mapOptionsClass = '.map-options';
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
        $(mapOptionsClass)
        this.clonedLegendBlock = $('.map_legend-block')[0].cloneNode(true);	//a legend block
        this.clonedLegend = $('.map-options__legend')[0].cloneNode(true);	//the legend itself
        this.clearLegend();
    }

    showMapChip(payload) {
        $(mapOptionsClass).removeClass('hidden');
        $(mapOptionsClass).show();  //webflow.js adds display:none when clicked on x
        $(mapOptionsClass).find('.filters__header_close').on('click', () => this.removeMapChip());

        this.handleChoroplethFilter(payload);
    }

    handleChoroplethFilter(payload) {
        let groups = [];

        for (const [title, detail] of Object.entries(payload.indicators)) {
            for (const [group, items] of Object.entries(detail.groups)) {
                groups.push(group);
            }
        }

        let siFilter = new SubindicatorFilter();
        let dropdowns = $(mapOptionsClass).find('.mapping-options__filter');
        let indicators = payload.indicators;
        siFilter.handleFilter(indicators, groups, payload.indicatorTitle, this, dropdowns);
    }

    applyFilter = (chartData) => {
        if (chartData !== null) {
            console.log(chartData)
        }
    }

    showMapOptions() {
        $(mapOptionsClass).removeClass('hidden');
    }

    showLegend(colors, intervals) {
        if (colors.length != intervals.length)
            throw "Expected the number of intervals to be the same as the number of colours."

        const legend = $(this.clonedLegend);
        const fmt = d3format(".1%")

        $(mapOptionsClass).find('.map-options__legend_wrap').html('');

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
            $(mapOptionsClass).find('.map-options__legend_wrap').append(item);
        }
    }

    updateMapChipText(textValue) {
        $(mapOptionsClass).find('.filters__header_name div').text(textValue);
    }

    clearLegend() {
        $(mapOptionsClass).addClass('hidden');
    }

    removeMapChip() {
        const element = $(mapOptionsClass)[0];
        this.clearLegend();
        this.triggerEvent('mapChipRemoved', element);
    }

    onChoropleth(payload) {
        this.showLegend(payload.colors, payload.intervals);
    }

    onSubIndicatorChange(payload, colors) {
        const label = `${payload.indicatorTitle} (${payload.obj.label})`
        this.updateMapChipText(label);
        this.showMapChip(payload);
    }
}
