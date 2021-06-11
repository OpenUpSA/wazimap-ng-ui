import { SubindicatorFilter } from "../../profile/subindicator_filter";
import { Observable } from "../../utils";
import { FilterController } from "./filter_controller";
import { Legend } from "./legend";

const filterContentClass = '.map-options__filters_content';
const mapChipBlockClass = '.map-options';
const filterRowClass = '.map-options__filter-row';
const legendContainerClass = '.map-options__legend_wrap';

/**
 * Represent the map chip at the bottom of the map
 */
 export class MapChip extends Observable {
    constructor(legendColors) {
        super();
        
        this.title = '';
        // this.filterArgs = null;

        this.prepareDomElements();
        this.prepareEvents();
        
        this.filterController = new FilterController();

        const legendBlock = this.container.find(legendContainerClass);
        this.legend = new Legend(legendBlock, legendColors);
    }

    prepareDomElements() {
        this.container = $(mapChipBlockClass);
        this.filterArea = this.container.find(filterContentClass);
        this.closeButton = $(mapChipBlockClass).find('.filters__header_close')
    }

    prepareEvents() {
        this.closeButton.on('click', () => this.removeMapChip());
    }

    setDescription(text) {
        $('.map-options__context .map-option__context_text div').text(text);
    }

    setTitle(indicatorTitle, selectedSubindicator) {

        let label = `${indicatorTitle} (${selectedSubindicator})`;
        if (indicatorTitle === selectedSubindicator) {
            label = indicatorTitle;
        }

        $(mapChipBlockClass).find('.filters__header_name div').text(label);
    }

    hide() {
        $(mapChipBlockClass).addClass('hidden');
    }

    show() {
        $(mapChipBlockClass).removeClass('hidden');
        $(mapChipBlockClass).show();  //webflow.js adds display:none when clicked on x
    }

    showMapChip(params) {
        this.show();
        this.setDescription(params.description); // TODO can I move this to prepareDomElements?
        
        this.handleChoroplethFilter(params);
    }

    removeMapChip() {
        this.hide();
        this.triggerEvent('mapchip.removed', this.container[0]);
    }

    handleChoroplethFilter(params) {
        let defaultFilters = [];
        let primaryGroup = params.primaryGroup;
        let groups = params.groups.filter(g => g.name != primaryGroup)
        this.filterController.groups = groups;
        
        this.filterController.clearExtraFilters();
        
        if (typeof params.filter !== 'undefined') {
            Array.prototype.push.apply(defaultFilters, params.filter);
        }

        if (typeof params.chartConfiguration.filter !== 'undefined') {
            params.chartConfiguration.filter['defaults'].forEach((f) => {
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

        for (let i = 1; i < defaultFilters.length; i++) {
            this.filterController.addFilter(defaultFilters[i].default);
        }
        let dropdowns = $(mapChipBlockClass).find(`${filterRowClass} .mapping-options__filter`);

        this.filterController.filter = new SubindicatorFilter(
            this.filterArea, groups, params.indicatorTitle, this.applyFilter, dropdowns, defaultFilters, params.childData
        );
        this.filterController.setAddFilterButton();
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
 

    onChoropleth(payload) {
        this.legend.show(payload.colors, payload.intervals);
    }
    

    onSubIndicatorChange(params) {
        if (typeof params.childData === 'undefined') {
            return;
        }

        this.setTitle(params.indicatorTitle, params.selectedSubindicator);
        this.showMapChip(params);
    }
}