import {checkIterate, Observable} from '../utils';
import {format as d3format} from 'd3-format';
import {SubindicatorFilter} from "../profile/subindicator_filter";

const wrapperClsName = 'content__map_current-display';
const mapOptionsClass = '.map-options';
const lightStart = 3;

let subindicatorKey = '';

/**
 * Represent the map chip at the bottom of the map
 */
export class MapChip extends Observable {
    constructor(legendColors) {
        super();
        this.legendColors = legendColors;
        this.prepareDomElements();
        this.title = '';
    }

    prepareDomElements() {
        const legendBlock = $('.map_legend-block')[0];
        this.clonedLegendBlock = legendBlock.cloneNode(true);	//a legend block
        this.clonedLegend = $('.map-options__legend')[0].cloneNode(true);	//the legend itself
        this.clearLegend();
    }

    showMapChip(args) {
        $(mapOptionsClass).removeClass('hidden');
        $(mapOptionsClass).show();
        $(mapOptionsClass).find('.filters__header_close').on('click', () => this.removeMapChip());

        this.setDescription(args);
        this.handleChoroplethFilter(args);
    }

    setDescription(args) {
        const description = args.data.metadata.description;

        $('.map-options__context .map-option__context_text div').text(description);
    }

    handleChoroplethFilter(args) {
        let groups = JSON.parse(args.data.metadata.groups);
        groups = groups.reduce(function (memo, e1) {
            let matches = memo.filter(function (e2) {
                return e1.name === e2.name
            })
            if (matches.length == 0)
                memo.push(e1)
            return memo;
        }, [])

        let dropdowns = $(mapOptionsClass).find('.mapping-options__filter');
        const filterArea = $(mapOptionsClass).find('.map-options__filters_content');
        new SubindicatorFilter(filterArea, groups, args.indicatorTitle, this, dropdowns, args.filter, args.data.child_data);
    }

    applyFilter = (subindicatorArr, selectedGroup, selectedFilter) => {
        if (subindicatorArr !== null) {
            const payload = {
                data: subindicatorArr
            }

            this.triggerEvent("mapchip.choropleth.filtered", payload)
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
            const label = interval;

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
        this.triggerEvent('mapchip.removed', element);
    }

    onChoropleth(payload) {
        this.showLegend(payload.colors, payload.intervals);
    }

    onSubIndicatorChange(args) {
        if (typeof args.data.child_data === 'undefined') {
            return;
        }

        let label = `${args.indicatorTitle} (${args.selectedSubindicator})`;
        if (args.indicatorTitle === args.selectedSubindicator) {
            label = args.indicatorTitle;
        }

        this.title = `${label}`;

        this.updateMapChipText(label);
        this.showMapChip(args);
    }
}
