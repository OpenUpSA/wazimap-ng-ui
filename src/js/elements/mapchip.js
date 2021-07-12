import {appendFilterArrays, checkIterate, getFilterGroups, Component} from '../utils';
import {format as d3format} from 'd3-format';
import {SubindicatorFilter} from "../profile/subindicator_filter";
import DropdownMenu from "./dropdown_menu";

const wrapperClsName = 'content__map_current-display';
const mapOptionsClass = '.map-options';
const filterRowClass = '.map-options__filter-row';
const filterContentClass = '.map-options__filters_content';
const lightStart = 3;

let subindicatorKey = '';

/**
 * Represent the map chip at the bottom of the map
 */
export class MapChip extends Component {
    constructor(parent, legendColors) {
        super(parent);

        this.legendColors = legendColors;
        this.filterArgs = null;
        this.prepareDomElements();
        this.title = '';
        this.groups = null;
        this.filter = null;
    }

    prepareDomElements() {
        const legendBlock = $('.map_legend-block')[0];
        this.clonedLegendBlock = legendBlock.cloneNode(true);	//a legend block
        this.clonedLegend = $('.map-options__legend')[0].cloneNode(true);	//the legend itself
        this.clearLegend();
    }

    showMapChip(args) {
        $(mapOptionsClass).removeClass('hidden');
        $(mapOptionsClass).show();  //webflow.js adds display:none when clicked on x
        $(mapOptionsClass).find('.filters__header_close').on('click', () => this.removeMapChip());

        $('.map-options__context .map-option__context_text div').text(args.data.description);
        this.handleChoroplethFilter(args);
    }

    handleChoroplethFilter(args) {
        let primaryGroup = args.data.metadata.primary_group;
        let groups = getFilterGroups(args.data.metadata.groups, primaryGroup);
        this.groups = groups;

        $(mapOptionsClass).find(`${filterRowClass}[data-isextra=true]`).remove();
        $(mapOptionsClass).find(`${filterRowClass} .mapping-options__remove-filter`).addClass('is--hidden');
        const filterArea = $(mapOptionsClass).find(filterContentClass);

        let filtersToAdd = [];
        if (typeof args.filter !== 'undefined') {
            filtersToAdd = appendFilterArrays(filtersToAdd, args.filter, primaryGroup);
        } else {
            let defaultFilters = this.getDefaultFilters(args);
            let nonAggFilters = this.getNonAggFilters(args);
            filtersToAdd = appendFilterArrays(defaultFilters, nonAggFilters, primaryGroup);
        }

        for (let i = 1; i < filtersToAdd.length; i++) {
            this.addFilter(filtersToAdd[i].default);
        }
        let dropdowns = $(mapOptionsClass).find(`${filterRowClass} .mapping-options__filter`);

        this.filter = new SubindicatorFilter(this, filterArea, groups, args.indicatorTitle, this.applyFilter, dropdowns, filtersToAdd, args.data.child_data, '.map-options__filter-row');

        this.setAddFilterButton();
    }

    getDefaultFilters = (args) => {
        let defaultFilters = [];

        if (typeof args.data.chartConfiguration.filter !== 'undefined') {
            args.data.chartConfiguration.filter['defaults'].forEach((f) => {
                let defaultFilter = {
                    group: f.name,
                    value: f.value,
                    default: true
                }

                let item = defaultFilters.filter((df) => {
                    return df.group === f.name
                })[0];
                if (item !== null && typeof item !== 'undefined') {
                    item.default = true;
                } else {
                    defaultFilters.push(defaultFilter);
                }
            })
        }

        return defaultFilters;
    }

    getNonAggFilters = (args) => {
        let filterArr = [];

        let nonAgg = [...args.data.metadata.groups].filter((g) => {
            return !g.can_aggregate;
        })
        nonAgg.forEach((n) => {
            let filter = {
                group: n.name,
                value: n.subindicators[Math.floor(Math.random() * n.subindicators.length)],
                default: true
            }

            let item = filterArr.filter((df) => {
                return df.group === n.name
            })[0];
            if (item !== null && typeof item !== 'undefined') {
                item.default = true;
            } else {
                filterArr.push(filter);
            }
        })

        return filterArr;
    }

    applyFilter = (filterResult, selectedFilter) => {
        if (filterResult !== null) {
            const payload = {
                data: filterResult,
                selectedFilter: selectedFilter
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

        this.filterArgs = args;
        let label = `${args.indicatorTitle} (${args.selectedSubindicator})`;
        if (args.indicatorTitle === args.selectedSubindicator) {
            label = args.indicatorTitle;
        }

        this.title = `${label}`;

        this.updateMapChipText(label);
        this.showMapChip(args);
    }

    setAddFilterButton() {
        let rowCount = $(filterContentClass).find(filterRowClass).length;
        let btn = 'a.mapping-options__new-filter';
        $(filterContentClass).find(filterRowClass).each(function (index) {
            if (index !== rowCount - 1) {
                $(this).find(btn).addClass('hidden');
            } else {
                $(this).find(btn).removeClass('hidden');
            }
        });

        if (this.filter.allDropdowns.length >= this.groups.length * 2) {
            $(btn).addClass('disabled');
        } else {
            $(btn).removeClass('disabled');
            $(filterContentClass).find(btn).off('click').on('click', () => this.addFilter());
        }
    }

    addFilter(isDefault = false) {
        let filterRow = $(filterRowClass)[0].cloneNode(true);

        let indicatorDd = $(filterRow).find('.mapping-options__filter')[0];
        let subindicatorDd = $(filterRow).find('.mapping-options__filter')[1];

        $(filterRow).attr('data-isextra', true);
        $(filterRow).attr('data-isdefault', isDefault);
        this.setRemoveFilter(filterRow, indicatorDd, subindicatorDd, isDefault);
        $(filterContentClass).append(filterRow);


        new DropdownMenu($(filterRow));
        if (this.filter !== null) {
            this.filter.allDropdowns.push(indicatorDd);
            this.filter.allDropdowns.push(subindicatorDd);
            this.filter.setDropdownEvents(indicatorDd, subindicatorDd);

            this.setAddFilterButton();
        }
    }

    setRemoveFilter(filterRow, indicatorDd, subindicatorDd, isDefault) {
        let btn = $(filterRow).find('.mapping-options__remove-filter');
        if (!isDefault) {
            btn.removeClass('is--hidden');
            btn.on('click', () => {
                this.removeFilter(filterRow, indicatorDd, subindicatorDd);
            })
        } else {
            btn.addClass('is--hidden');
        }
    }

    removeFilter(filterRow, indicatorDd, subindicatorDd) {
        $(filterRow).remove();
        this.filter.allDropdowns = this.filter.allDropdowns.filter((dd, el) => {
            return el !== indicatorDd && el !== subindicatorDd
        })

        this.filter.handleFilter(null);

        this.setAddFilterButton();
    }
}
