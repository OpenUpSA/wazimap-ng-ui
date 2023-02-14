import {FilterRow} from "../../ui_components/filter_row";
import {Component, Observable} from "../../utils";
import {AddFilterButton} from "../../ui_components/add_filter_button";
import {DataFilterModel} from "../../models/data_filter_model";
import {isEmpty} from 'lodash';
import {SidePanels} from "../side_panels";


class FilterControllerModel extends Observable {
    static EVENTS = {
        filterRemoved: 'FilterControllerModel.filterRemoved',
        dataFilterModelUpdated: 'FilterControllerModel.dataFilterModelUpdated'
    }

    constructor(dataModelFilter = null) {
        super()
        this._filterRows = [];
        this._dataFilterModel = dataModelFilter;
    }

    get filterRows() {
        return this._filterRows;
    }

    addFilterRow(filterRow) {
        this._filterRows.push(filterRow);
    }

    get dataFilterModel() {
        return this._dataFilterModel;
    }

    removeFilterRow(filterRow) {
        this._filterRows = this._filterRows.filter(filter => filter != filterRow)
        this.triggerEvent(FilterControllerModel.EVENTS.filterRemoved, filterRow)
    }

    reset() {
        this._filterRows.forEach(filterRow => {
            this.triggerEvent(FilterControllerModel.EVENTS.filterRemoved, filterRow)
        })

        this._filterRows = []
    }

    set dataFilterModel(dataFilterModel) {
        this.reset();

        this._dataFilterModel = dataFilterModel;
        this.triggerEvent(FilterControllerModel.EVENTS.dataFilterModelUpdated, this);
    }
}

export class FilterController extends Component {

    static EVENTS = {
        ready: 'FilterController.ready'
    }

    constructor(parent, container, elements = {
        filterRowClass: '.map-options__filter-row',
        filterDropdown: '.mapping-options__filter',
        addButton: 'a.mapping-options__add-filter',
        filterPanel: SidePanels.PANELS.dataMapper,
        removeFilterButton: '.mapping-options__remove-filter'
    }) {
        super(parent);
        this._container = container;
        this._model = new FilterControllerModel();
        this._addFilterButton = new AddFilterButton(this, elements);
        this._dataFilterModel = null;
        this._filterCallback = null;
        this._elements = elements;
        this._isLoading = true;
        this._noFiltersAvailable = true;

        this._mapBottomItems = '.map-bottom-items--v2';
        this._upArrow = `${this._mapBottomItems} .map-options .toggle-icon-v--last`;
        this._downArrow = `${this._mapBottomItems} .map-options .toggle-icon-v--first`;
        this._descriptionIcon = `${this._mapBottomItems} .map-options .filters__header_info`;
        this._filterCountContainer = `${this._mapBottomItems} .map-options .filters__header_label`;
        this._filterContent = `${this._mapBottomItems} .map-options__filters_content`;
        this._isContentVisible = parent.isContentVisible;
        this.prepareDomElements();
        this.prepareEvents();
    }

    get isContentVisible() {
        return this._isContentVisible;
    }

    set isContentVisible(value) {
        this._isContentVisible = value;
        this.parent.isContentVisible = value;
        this.toggleContentVisibility();
    }

    get container() {
        return this._container;
    }

    get model() {
        return this._model;
    }

    get addFilterButton() {
        return this._addFilterButton;
    }

    get filterCallback() {
        return this._filterCallback;
    }

    set filterCallback(filterCallback) {
        this._filterCallback = filterCallback;
    }

    get isLoading() {
        return this._isLoading;
    }

    set isLoading(value) {
        if (value) {
            $(this.container).find('.map-options__loading').removeClass('hidden');
            $(this.container).find('.mapping-options__add-filter').addClass('hidden');
            $(this.container).find('.map-options__filter-row').addClass('hidden')
            $(this.container).find('.map-options__no-data').addClass('hidden');
        } else {
            $(this.container).find('.map-options__loading').addClass('hidden');
        }

        this._isLoading = value;
    }

    get noFiltersAvailable() {
        return this._noFiltersAvailable;
    }

    set noFiltersAvailable(value) {
        if (value) {
            this.addFilterButton.hide();
            this.isLoading = false;
            $(this.container).find('.map-options__no-data').removeClass('hidden');
        } else {
            this.addFilterButton.show();
            $(this.container).find('.map-options__no-data').addClass('hidden');
        }

        this._noFiltersAvailable = value;
    }

    prepareDomElements() {
        this._rowContainer = $(this.container).find(this._elements.filterRowClass)[0];
        $(this._rowContainer).hide();

        while ($(this.container).find(this._elements.filterRowClass).length > 1) {
            $(this.container).find(this._elements.filterRowClass)[1].remove();
        }
        this.setContentVisibility();
        this.toggleContentVisibility();
    }

    prepareEvents() {
        const self = this;
        this.addFilterButton.on(AddFilterButton.EVENTS.clicked, () => {
            self.addEmptyFilter()
        })
    }

    setFilterVisibility() {
        const isVisible = this.shouldFiltersBeVisible();
        this.noFiltersAvailable = !isVisible;
    }

    shouldFiltersBeVisible() {
        const nonAggregatableGroups = this.model.dataFilterModel.nonAggregatableGroups;
        const defaultGroups = this.model.dataFilterModel.defaultFilterGroups;

        if (nonAggregatableGroups.length <= 0 && defaultGroups.length <= 0 && this.model.dataFilterModel.availableFilters.length <= 0) {
            return false;
        } else {
            return true;
        }
    }

    addInitialFilterRow(dataFilterModel) {
        if (this.noFiltersAvailable || !isEmpty(dataFilterModel.previouslySelectedFilters)) {
            this.isLoading = false;
            return;
        }

        let isDefault = true;
        let isExtra = false;

        this.addEmptyFilter(isDefault, isExtra);

        this.isLoading = false;
    }

    addEmptyFilter(isDefault = false, isExtra = true, isRequired = false, addAsFirstRow = false, isPreviouslySelected = false) {
        if (this.model.dataFilterModel.availableFilters.length > 0) {
            const self = this;

            let filterRowContainer = this._rowContainer.cloneNode(true);
            $(filterRowContainer).removeClass('hidden').show();

            let filterRow = new FilterRow(this, filterRowContainer, this.model.dataFilterModel, isDefault, isExtra, isRequired, isPreviouslySelected, this._elements);
            this.model.addFilterRow(filterRow);

            this.addFilterButton.show();
            if (addAsFirstRow) {
                let elementToInsertBefore = $(this.container).find(`${this._elements.filterRowClass}:not(.hidden)`)[0];
                if (elementToInsertBefore === undefined) {
                    elementToInsertBefore = $(this.container).find(this._elements.addButton);
                }
                $(filterRow.container).insertBefore(elementToInsertBefore);
            } else {
                $(filterRow.container).insertBefore($(this.container).find(this._elements.addButton));
            }

            filterRow.on(FilterRow.EVENTS.removed, filterRow => {
                self.removeFilter(filterRow);
            })

            return filterRow;
        }
    }

    addNonAggregatableFilter(group) {
        let isDefault = true;
        let isExtra = false;
        let isRequired = true;
        let isPreviouslySelected = true;
        let addAsFirstRow = false;
        let index = 0;

        let filterRow = this.addEmptyFilter(isDefault, isExtra, isRequired, addAsFirstRow, isPreviouslySelected);
        try {
            if (filterRow !== undefined) {
                filterRow.indicatorDropdown.disable();

                filterRow.setPrimaryIndexUsingValue(group.name);
                filterRow.setSecondaryIndex(index);
            }
        } catch (err) {
            if (filterRow !== undefined) {
                console.error(err);
                filterRow.removeRow();
            }
        }
    }

    addDefaultFilter(group) {
        let isDefault = true;
        let isExtra = false;
        let isRequired = true;
        let addAsFirstRow = true;
        let isPreviouslySelected = true;

        let filterRow = this.addEmptyFilter(isDefault, isExtra, isRequired, addAsFirstRow, isPreviouslySelected);
        try {
            if (filterRow !== undefined) {
                filterRow.indicatorDropdown.disable();

                filterRow.setPrimaryIndexUsingValue(group.group);
                filterRow.setSecondaryIndexUsingValue(group.value);
            }
        } catch (err) {
            if (filterRow !== undefined) {
                console.error(err);
                filterRow.removeRow();
            }
        }
    }

    addPreviouslySelectedFilters(group, isDefault, isPreviouslySelected) {
        let filterRow = this.addEmptyFilter(isDefault, false, false, false, isPreviouslySelected);

        filterRow.setPrimaryIndexUsingValue(group.group);
        filterRow.setSecondaryIndexUsingValue(group.value);
    }

    setAddFilterButton() { // TODO write an unselected filters getter in the data model
        if (this.model.dataFilterModel.availableFilters.length > 0)
            this.addFilterButton.enable();
        else
            this.addFilterButton.disable();
    }

    addFilter(filterName, isDefault = false, isExtra = true, isPreviouslySelected = false) {
        const self = this;

        let dataFilter = this._dataFilterModel[filterName];

        if (dataFilter != undefined) {
            let filterRowContainer = $(this._elements.filterRowClass)[0].cloneNode(true);
            let filterRow = new FilterRow(this, filterRowContainer, dataFilter, isDefault, isExtra, isPreviouslySelected, this._elements);
            this.filterRows.push(filterRow);
            this._dataFilterModel.addFilter(filterName, this._elements.filterPanel);

            filterRow.on(FilterRow.EVENTS.removed, filterRow => {
                self.removeFilter(filterRow);
            })

            $(filterRow.container).insertBefore($('a.mapping-options__add-filter')); // TODO can I change this to addButton or something

            return filterRow

        } else {
            throw `Could not find filter: ${filterName}`;
        }
    }

    removeFilter(filterRow) {
        this.model.removeFilterRow(filterRow);
    }

    clearExtraFilters() {
        const self = this;
        this.model.filterRows.forEach(filterRow => {
            filterRow.removeRow();
        })
    }

    reset() {
        this.clearExtraFilters();
        this._dataFilterModel = null;
    }

    setDataFilterModel(dataFilterModel) {
        this.reset();
        this.model.dataFilterModel = dataFilterModel;

        this.model.dataFilterModel.on(DataFilterModel.EVENTS.updated, (data) => {
            if (this.filterCallback !== null) {
                this.filterCallback(this.model.dataFilterModel.filteredData, this.model.dataFilterModel.selectedSubIndicators, this.model.dataFilterModel.selectedFilterDetails, data.updateSharedUrl);
            }

            this.updateAvailableFiltersOfRows();
            this.setAddFilterButton();
        })
        // first add previous filters
        this.checkAndAddPreviouslySelectedFilters();
        // then add default filters
        this.checkAndAddNonAggregatableGroups();
        this.checkAndAddDefaultFilterGroups();

        this.setFilterVisibility();
        this.addInitialFilterRow(dataFilterModel);
    }

    /**
     * this function will be triggered when the filters are updated outside the mapchip or rich data
     * e.g when user removes a filter from my view panel
     **/
    filtersUpdatedInMyView(filteredIndicator, panel) {
        this.model.filterRows.forEach((row) => {
            const selectedGroup = row.model.currentIndicatorValue;
            const selectedValue = row.model.currentSubindicatorValue;
            const filters = filteredIndicator.filters;
            const filterRemains = filters.some(f => f.group === selectedGroup && f.value === selectedValue && f.appliesTo.indexOf(panel) >= 0);

            if (!filterRemains && selectedGroup !== 'All indicators') {
                row.removeRow();

                this.checkAndAddNonAggregatableGroups();
                this.checkAndAddDefaultFilterGroups();

                const remainingRowLength = this.model.filterRows.filter(x => x.model.currentIndicatorValue !== 'All indicators').length;
                if (remainingRowLength <= 0) {
                    this.addEmptyFilter(true);
                }
            }
        })

        // this cannot be in the loop above
        this.model.filterRows.filter(x => x.model.currentIndicatorValue !== 'All indicators').forEach((row, index) => {
            if (index === 0) {
                // the remove button shouldn't be visible
                row.hideRemoveButton();
            }
        })
    }

    updateAvailableFiltersOfRows() {
        this.model.filterRows.forEach((fr) => {
            if (fr.model.currentIndicatorValue !== 'All values') {
                let lastIndex = fr.model.indicatorValues.length - 1;
                fr.updateIndicatorDropdowns(fr.model, lastIndex);
            }
        })
    }

    updateDefaultFilterValues(group) {
        let filterRow = this.model.filterRows.find(fr => fr.model.currentIndicatorValue === group.group);
        if (filterRow !== undefined) {
            filterRow.setSecondaryIndexUsingValue(group.value);
        }
    }

    checkAndAddNonAggregatableGroups() {
        const self = this;
        let nonAggregatableGroups = this.model.dataFilterModel.nonAggregatableGroups;
        let defaultGroups = this.model.dataFilterModel.defaultFilterGroups;

        nonAggregatableGroups.forEach(group => {
            if (group.name != this.model.dataFilterModel.primaryGroup && !defaultGroups.some(x => x.group === group.name)) {
                self.addNonAggregatableFilter(group);
            } else {
                this.model.filterRows.filter(x => x.model.currentIndicatorValue === group.name).forEach(row => {
                    row.indicatorDropdown.disable();
                    row.indicatorDropdown.model.isDisabled = true;
                })
            }
        })
    }

    checkAndAddDefaultFilterGroups() {
        const self = this;
        let defaultGroups = this.model.dataFilterModel.defaultFilterGroups;

        defaultGroups.forEach(group => {
            const alreadyAdded = this.model.filterRows.some(x => x.model.currentIndicatorValue === group.group && x.model.currentSubindicatorValue === group.value);

            if (!alreadyAdded && group.group !== this.model.dataFilterModel.primaryGroup) {
                self.addDefaultFilter(group);
            } else {
                this.model.filterRows.filter(x => x.model.currentIndicatorValue === group.group).forEach(row => {
                    row.indicatorDropdown.disable();
                    row.indicatorDropdown.model.isDisabled = true;
                })
            }
        })
    }

    checkAndAddPreviouslySelectedFilters() {
        const self = this;
        let previouslySelectedFilters = this.model.dataFilterModel.previouslySelectedFilterGroups;
        previouslySelectedFilters.forEach((group, index) => {
            const alreadyAdded = this.model.filterRows.some(x => x.model.currentIndicatorValue === group.group && x.model.currentSubindicatorValue === group.value);
            if (!alreadyAdded && group.group != this.model.dataFilterModel.primaryGroup) {
                self.addPreviouslySelectedFilters(group, index === 0, true);
            }
        })
    }

    toggleContentVisibility() {
        if (this.isContentVisible) {
            this.showFilterContent();
            this.showDescription();
        } else {
            this.hideFilterContent();
            this.hideDescription();
        }
    }

    setContentVisibility() {
        $(this._upArrow).on('click', () => {
            this.isContentVisible = true;
        });

        $(this._downArrow).on('click', () => {
            this.isContentVisible = false;
        });

        $(this._descriptionIcon).on('click', () => {
            this.isContentVisible = true;
        });

        $(this._filterCountContainer).on('click', () => {
            this.isContentVisible = true;
        });
    }

    showFilterContent() {
        $(this._upArrow).addClass('hidden');
        $(this._downArrow).removeClass('hidden');
        $(this._filterContent).removeClass('hidden')
    }

    hideFilterContent() {
        $(this._upArrow).removeClass('hidden');
        $(this._downArrow).addClass('hidden');
        $(this._filterContent).addClass('hidden');
    }

    showDescription() {
        $('.map-options__context--v2').removeClass('hidden');
    }

    hideDescription() {
        $('.map-options__context--v2').addClass('hidden');
    }
}
