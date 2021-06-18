import {FilterController} from "../subindicator_filter/filter_controller";
import {Legend} from "./legend";
import {DataFilterModel} from "../../models/data_filter_model";
import {Observable} from "../../utils";

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

        this.prepareDomElements();

        this._filterController = new FilterController(this._filtersContainer);
        this._legend = new Legend(this._legendContainer, legendColors);

        this.prepareEvents();
    }

    get container() {
        return this._container;
    }

    prepareDomElements() {
        this._container = $(mapChipBlockClass)[0];
        // this.filterArea = this.container.find(filterContentClass); // TODO should this live here?
        this._closeButton = $(this.container).find('.filters__header_close')
        this._descriptionArea = $('.map-options__context .map-option__context_text div');
        this._filtersContainer = $(this.container).find(filterContentClass);
        this._legendContainer = $(this.container).find(legendContainerClass);
    }

    prepareEvents() {
        this._closeButton.on('click', () => this.removeMapChip());
    }

    setDescription(text) {
        this._descriptionArea.text(text);
    }

    setTitle(indicatorTitle, selectedSubindicator) {

        let label = `${indicatorTitle} (${selectedSubindicator})`;
        if (indicatorTitle === selectedSubindicator) {
            label = indicatorTitle;
        }

        $(this.container).find('.filters__header_name div').text(label);
    }

    hide() {
        $(this.container).addClass('hidden');
        // $(mapChipBlockClass).addClass('hidden');
    }

    show() {
        $(this.container).removeClass('hidden');
        $(this.container).show();  //webflow.js adds display:none when clicked on x
    }

    removeMapChip() {
        this.hide();
        this.triggerEvent('mapchip.removed', this.container);
    }

    handleChoroplethFilter(params, dataFilterModel) {
        let defaultFilters = [];
        // let primaryGroup = params.primaryGroup;
        // let groups = params.groups.filter(g => g.name != primaryGroup)
        // this.filterController.groups = groups; // TODO should pass in the dataFilterModel, should also reset
        // this._filterController.setDataFilterModel(dataFilterModel);

        // this.filterController.clearExtraFilters();

        // let filtersToAdd = [];
        // if (typeof params.filter !== 'undefined') {
        //     filtersToAdd = filtersToAdd.concat(params.filter);
        // } else {
        //     let defaultFilters = this.getDefaultFilters(params.chartConfiguration);
        //     let nonAggFilters = this.getNonAggFilters(params.groups);
        //     filtersToAdd = defaultFilters.concat(nonAggFilters);
        // }

        // for (let i = 1; i < filtersToAdd.length; i++) {
        //     this.filterController.addFilter(filtersToAdd[i].default);
        // }

        // let dropdowns = $(mapChipBlockClass).find(`${filterRowClass} .mapping-options__filter`);

        // this.filterController.filter = new SubindicatorFilter(
        //     this.filterArea, groups, params.indicatorTitle, this.applyFilter, dropdowns, filtersToAdd, params.childData, '.map-options__filter-row'
        // );

        // this.filterController.setAddFilterButton();
    }

    getDefaultFilters = (chartConfiguration) => {
        let defaultFilters = [];

        if (typeof chartConfiguration.filter !== 'undefined') {
            chartConfiguration.filter['defaults'].forEach((f) => {
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

    getNonAggFilters = (groups) => {
        let filterArr = [];

        let nonAgg = [...groups].filter((g) => {
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
        console.log({filterResult, selectedFilter})
        if (filterResult !== null) {
            const payload = {
                data: filterResult,
                selectedFilter: selectedFilter
            }

            this.triggerEvent("mapchip.choropleth.filtered", payload)
        }
    }

    onChoropleth(payload) {
        this._legend.show(payload.colors, payload.intervals);
    }


    onSubIndicatorChange(params) {
        if (typeof params.childData === 'undefined') {
            return;
        }

        let dataFilterModel = new DataFilterModel(params.groups, params.primaryGroup, params.childData);
        this.setTitle(params.indicatorTitle, params.selectedSubindicator);
        this.setDescription(params.description);
        this.show()
        this.handleChoroplethFilter(params, dataFilterModel);
        this._filterController.setDataFilterModel(dataFilterModel);
        this._filterController.filterCallback = this.applyFilter;
    }
}
