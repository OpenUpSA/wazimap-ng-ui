import {Observable} from "../utils";
import {DataFilter} from "./data_filter";

/**
 * A class that stores the state of a dataset filter. Consists of a list of indicators,
 * each of which has a list of subindicators. This class stores the state of which indicator has been selected
 * and whether a subindicator has been selecte for that indicator
 *
 * It stores a list of:
 * - Aggregatable Groups
 * - Non-aggregatable Groups
 * - The primary group
 * - The indicator filters that have been selected
 * - Selected subindicators for each indicator filter
 * - Available indicator filters
 *
 * TODO naming is not consistent, need to decide between filters and indicators
 */
export class DataFilterModel extends Observable {
    static EVENTS = {
        updated: 'DataFilterModel.updated' // triggered whenever an event occurs that would affect the filtering of a dataset
    }

    constructor(groups, configFilters, previouslySelectedFilters, primaryGroup, childData) {
        super()

        const self = this;

        this.filters = [];
        this.groupLookup = {};
        this.configFilters = configFilters;

        this._primaryGroup = primaryGroup;
        this._previouslySelectedFilters = previouslySelectedFilters;
        this._selectedFilters = new Set()
        this._selectedSubindicators = {}
        this._childData = childData;
        this._filteredData = {};

        groups.forEach(group => {
            let dataFilter = new DataFilter(group);
            self.filters.push(dataFilter);

            this.groupLookup[dataFilter.name] = dataFilter;
        });
    }

    get aggregatableGroups() {
        return Object.values(this.groupLookup).filter(group => group.can_aggregate);
    }

    get nonAggregatableGroups() {
        return Object.values(this.groupLookup).filter(group => !(group.can_aggregate));
    }

    get defaultFilterGroups() {
        let defaultFilterGroups = [];
        if (typeof this.configFilters !== 'undefined') {
            this.configFilters['defaults'].forEach((f) => {
                    let defaultFilter = {
                        group: f.name,
                        value: f.value
                    }

                    defaultFilterGroups.push(defaultFilter);
                }
            );
        }

        return defaultFilterGroups;
    }

    get selectedFilters() {
        return this._selectedFilters;
    }

    get primaryGroup() {
        return this._primaryGroup;
    }

    get selectedSubIndicators() {
        return this._selectedSubindicators;
    }

    get childData() {
        return this._childData;
    }

    get filteredData() {
        return this._filteredData;
    }

    set filteredData(_filteredData) {
        this._filteredData = _filteredData;
    }

    get previouslySelectedFilters(){
        return this._previouslySelectedFilters;
    }

    get availableFilters() {
        const self = this;
        let filters = Object.values(this.groupLookup);

        return filters.filter(filter => {
            if (filter.name == this.primaryGroup)
                return false;

            return !(self.selectedFilters.has(filter));
        });
    }

    get availableFilterNames() {
        let filters = [...this.availableFilters]
        return filters.map(f => f.name)
    }

    addFilter(indicatorName) {
        let dataFilter = this.groupLookup[indicatorName];
        if (dataFilter != undefined) {
            this._selectedFilters.add(dataFilter);
            this.triggerEvent(DataFilterModel.EVENTS.updated, this)
        } else {
            throw `addFilter: Can't find indicator: ${indicatorName}`
        }
    }

    removeFilter(indicatorName) {
        let dataFilter = this.groupLookup[indicatorName];
        if (dataFilter != undefined) {
            this._selectedFilters.delete(dataFilter);
            delete this.selectedSubIndicators[dataFilter.name];
            this.triggerEvent(DataFilterModel.EVENTS.updated, this)
        } else {
            throw `removeFilter: Can't find indicator: ${indicatorName}`
        }
    }

    setSelectedSubindicator(indicatorName, subindicatorValue) {
        // if (this._selectedSubindicators[indicatorName] == undefined)
        //     throw `setSelectedSubindicator: Can't find indicator: ${indicatorName}`

        if (this._selectedSubindicators[indicatorName] != subindicatorValue) {
            this._selectedSubindicators[indicatorName] = subindicatorValue
        }
    }

    updateFilteredData() {
        let _filteredData = {};

        for (const [geo, arr] of Object.entries(this.childData)) {
            _filteredData[geo] = arr.filter((a) => {
                let isFiltered = true;
                for (let key in this.selectedSubIndicators) {
                    if (a[key] !== this.selectedSubIndicators[key]) {
                        isFiltered = false;
                    }
                }

                return isFiltered;
            });
        }

        this.filteredData = _filteredData;
        this.triggerEvent(DataFilterModel.EVENTS.updated, this);
    }
}