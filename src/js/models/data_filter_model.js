import {Observable, trimValue} from "../utils";
import {DataFilter} from "./data_filter";
import {isEqual} from "vega-lite";

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
        updated: 'DataFilterModel.updated', // triggered whenever an event occurs that would affect the filtering of a dataset
        filtersChanged: 'DataFilterModel.filtersChanged'
    }

    static FILTER_TYPE = {
        indicators: 'indicators',
        points: 'points'
    }

    constructor(groups, configFilters, previouslySelectedFilters, primaryGroup, childData, siteWideFilters = [], filterType = DataFilterModel.FILTER_TYPE.indicators) {
        super()

        this._groups = groups;
        this.configFilters = configFilters;

        this._primaryGroup = primaryGroup;
        this._previouslySelectedFilters = previouslySelectedFilters;
        this._selectedFilters = new Set()
        this._selectedSubindicators = {}
        this._childData = childData;
        this._filteredData = {};
        this._siteWideFilters = siteWideFilters;
        this._filterFunction = filterType === DataFilterModel.FILTER_TYPE.indicators ? this.getFilteredIndicatorData : this.getFilteredPointData;
        this._filterType = filterType;
    }

    get aggregatableGroups() {
        return Object.values(this.groupLookup).filter(group => group.can_aggregate);
    }

    get nonAggregatableGroups() {
        return Object.values(this.groupLookup).filter(group => !(group.can_aggregate));
    }

    get groups() {
        return this._groups;
    }

    set groups(value) {
        this._groups = value;
    }

    get keys() {
        let keys = {
            name: 'name',
            values: 'subindicators'
        };
        if (this._filterType === DataFilterModel.FILTER_TYPE.points) {
            keys.values = 'values';
        }

        return keys;
    }

    get groupLookup() {
        let self = this;
        let gr = {};
        this.groups.forEach(group => {
            let dataFilter = new DataFilter(group, self.keys);

            gr[dataFilter[this.keys.name]] = dataFilter;
        });
        return gr;
    }

    get filters() {
        let self = this;
        let filters = [];
        this.groups.forEach(group => {
            let dataFilter = new DataFilter(group, self.keys);
            filters.push(dataFilter);
        });

        return filters;
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

    get previouslySelectedFilterGroups() {
        let previouslySelectedFilterGroups = [];

        this.previouslySelectedFilters.forEach(selectedFilter => {
            selectedFilter.filters.forEach(x => {
                previouslySelectedFilterGroups.push({
                    group: x.group,
                    value: x.value
                });
            })
        })

        return previouslySelectedFilterGroups;
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

    get selectedFilterDetails() {
        const self = this;
        let details = [...self.selectedFilters].map(sf => {
            const group = sf.group.name;
            const value = self._selectedSubindicators[group];
            const isDefault = self.defaultFilterGroups
                    .some(f => f.group === group && f.value === self._selectedSubindicators[group])
                || self.nonAggregatableGroups.some(x => x.name === group && x.values[0] === value);

            return {
                group: group,
                value: value,
                isDefault: isDefault,
                appliesTo: [sf.filterPanel],
                isSiteWideFilter: self.isSiteWideFilter(group, value)
            };
        })

        return details.filter(x => x.value !== undefined);
    }

    get childData() {
        return this._childData;
    }

    set childData(value) {
        this._childData = value;
    }

    get filteredData() {
        return this._filteredData;
    }

    set filteredData(_filteredData) {
        this._filteredData = _filteredData;
    }

    get previouslySelectedFilters() {
        return this._previouslySelectedFilters;
    }

    get availableFilters() {
        const self = this;
        let filters = Object.values(this.groupLookup);

        return filters.filter(filter => {
            let isAvailable = true;

            if (filter.name === this.primaryGroup)
                isAvailable = false;

            self.selectedFilters.forEach((sf) => {
                if (sf.group.name === filter.name)
                    isAvailable = false;
            })

            return isAvailable;
        });
    }

    get availableFilterNames() {
        let filters = [...this.availableFilters]
        return filters.map(f => f.name)
    }

    get siteWideFilters() {
        return this._siteWideFilters;
    }

    set siteWideFilters(value) {
        this._siteWideFilters = value;
    }

    isSiteWideFilter(group, value) {
        return this.siteWideFilters.filter(x => x.indicatorValue === group && x.subIndicatorValue === value)[0] != null;
    }

    addFilter(indicatorName, filterPanel) {
        let dataFilter = this.groupLookup[indicatorName];
        if (dataFilter !== undefined) {
            this._selectedFilters.add({
                group: dataFilter,
                filterPanel: filterPanel
            });
        } else {
            throw `addFilter: Can't find indicator: ${indicatorName}`
        }
    }

    removeFilter(indicatorName) {
        let dataFilter = this.groupLookup[indicatorName];
        let previouslyFiltered = this.isPreviouslyFiltered(indicatorName);
        if (dataFilter !== undefined || previouslyFiltered) {
            // if the dataFilter is undefined and previouslyFiltered = true it means
            // the only category that had this field is unchecked from point mapper
            this.selectedFilters.forEach((sf) => {
                if (sf.group.name === indicatorName) {
                    this.selectedFilters.delete(sf);
                }
            })
            delete this.selectedSubIndicators[indicatorName];
            this.triggerEvent(DataFilterModel.EVENTS.updated, this)
        } else {
            throw `removeFilter: Can't find indicator: ${indicatorName}`
        }
    }

    isPreviouslyFiltered(indicatorName) {
        let filtered = false;
        this.selectedFilters.forEach((sf) => {
            if (sf.group.name === indicatorName) {
                filtered = true;
            }
        })

        return filtered;
    }

    setSelectedSubindicator(indicatorName, subindicatorValue) {
        if (this._selectedSubindicators[indicatorName] != subindicatorValue) {
            this._selectedSubindicators[indicatorName] = subindicatorValue;
        }
    }

    updateFilteredData() {
        const _filteredData = this._filterFunction();

        this.filteredData = _filteredData;
        this.triggerEvent(DataFilterModel.EVENTS.updated, this);
    }

    getFilteredIndicatorData() {
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

        return _filteredData;
    }

    getFilteredPointData() {
        let activePoints = [...this.childData];
        let result = [];

        activePoints.forEach((ap) => {
            let add = true;

            for (let key in this.selectedSubIndicators) {
                const value = trimValue(this.selectedSubIndicators[key]);
                if (ap.point.data.filter(x => x.key === key && trimValue(x.value) === value).length <= 0) {
                    add = false;
                }
            }

            if (add) {
                result.push(ap);
            }
        })

        return result;
    }
}
