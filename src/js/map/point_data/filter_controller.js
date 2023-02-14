import {Component, Observable} from "../../utils";
import {FilterRow} from "../../ui_components/filter_row";
import {AddFilterButton} from "../../ui_components/add_filter_button";
import {DataFilterModel} from "../../models/data_filter_model";

class FilterControllerModel extends Observable {
    static EVENTS = {
        filterRemoved: 'FilterControllerModel.filterRemoved',
        dataFilterModelUpdated: 'FilterControllerModel.dataFilterModelUpdated'
    }

    constructor(dataModelFilter) {
        super();
        this._filterRows = [];
        this._dataFilterModel = dataModelFilter;
    }

    get filterRows() {
        return this._filterRows;
    }

    addFilterRow(filterRow) {
        this._filterRows.push(filterRow);
    }

    removeFilterRow(filterRow) {
        this._filterRows = this._filterRows.filter(filter => filter != filterRow)
        this.triggerEvent(FilterControllerModel.EVENTS.filterRemoved, filterRow)
    }
}

export class FilterController extends Component {
    constructor(parent) {
        super(parent);

        this._model = new FilterControllerModel();
        this._filterCallback = null;
        this._container = null;
        this._noFiltersAvailable = true;
        this._isLoading = true;
        this._mapBottomItems = '.map-bottom-items--v2';

        this.prepareDomElements();

        this._addFilterButton = new AddFilterButton(this, this.elements);

        this.prepareEvents();
    }

    get model() {
        return this._model;
    }

    get container() {
        return this._container;
    }

    get addFilterButton() {
        return this._addFilterButton;
    }

    get elements() {
        return {
            removeFilterButton: '.point-filters__remove-filter',
            addButton: '.point-filters__add-filter',
            filterDropdown: '.point-filters__filter',
            filterRowClass: '.point-filters__filter-row'
        }
    }

    get filterCallback() {
        return this._filterCallback;
    }

    set filterCallback(filterCallback) {
        this._filterCallback = filterCallback;
    }

    get noFiltersAvailable() {
        return this._noFiltersAvailable;
    }

    set noFiltersAvailable(value) {
        if (value) {
            this.addFilterButton.hide();
            $('.point-filters__no-data').removeClass('hidden');
        } else {
            this.addFilterButton.show();
            $('.point-filters__no-data').addClass('hidden');
        }

        this._noFiltersAvailable = value;
    }

    get isLoading() {
        return this._isLoading;
    }

    set isLoading(value) {
        if (value) {
            $('.point-filters__loading').removeClass('hidden');
        } else {
            $('.point-filters__loading').addClass('hidden');
        }

        this._isLoading = value;
    }

    prepareDomElements() {
        this._container = $(`${this._mapBottomItems} .point-filters .point-filters_content`);
        this._rowContainer = $(`${this._mapBottomItems} .point-filters`).find(this.elements.filterRowClass)[0];
        $(this._rowContainer).hide();

        while ($(this._container).find(this.elements.filterRowClass).length > 1) {
            $(this._container).find(this.elements.filterRowClass)[1].remove();
        }
    }

    prepareEvents() {
        const self = this;
        this.addFilterButton.on(AddFilterButton.EVENTS.clicked, () => {
            self.addEmptyFilter()
        })
    }

    addEmptyFilter(isDefault = false, isExtra = true) {
        if (this.model.dataFilterModel.availableFilters.length > 0 || isDefault) {
            const self = this;

            let filterRowContainer = self._rowContainer.cloneNode(true);
            $(filterRowContainer).removeClass('hidden').show();

            let filterRow = new FilterRow(self, filterRowContainer, this.model.dataFilterModel, isDefault, isExtra, false, false, self.elements);
            this.model.addFilterRow(filterRow);

            $(filterRow.container).insertBefore($(self.container).find(self.elements.addButton));

            filterRow.on(FilterRow.EVENTS.removed, filterRow => {
                self.removeFilter(filterRow);
            })

            return filterRow;
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

        this.model.dataFilterModel.on(DataFilterModel.EVENTS.updated, () => {
            if (this.filterCallback !== null) {
                this.filterCallback(this.model.dataFilterModel.filteredData, this.model.dataFilterModel.selectedSubIndicators);
            }

            this.updateAvailableFiltersOfRows();
            this.setAddFilterButton();
        })

        this.noFiltersAvailable = this.model.dataFilterModel.availableFilters.length <= 0;
        if (!this.noFiltersAvailable) {
            this.addEmptyFilter(true, false);
        }
        this.isLoading = false;
    }

    updateDataFilterModel(dataFilterModel) {
        this.model.dataFilterModel.groups = dataFilterModel.groups;
        this.model.dataFilterModel.childData = dataFilterModel.childData;

        this.updateAvailableFiltersOfRows();
        this.model.dataFilterModel.updateFilteredData();

        const addFilterRow = this.noFiltersAvailable && this.model.dataFilterModel.availableFilters.length > 0;   //no filters were available but now there are filterable fields
        const removeFilterRow = !this.noFiltersAvailable && this.model.dataFilterModel.availableFilters.length <= 0;    //there were filterable fields but now there are none

        this.noFiltersAvailable = this.model.dataFilterModel.availableFilters.length <= 0;

        if (addFilterRow) {
            this.addEmptyFilter(true, false);
        }

        if (removeFilterRow) {
            this.model.filterRows.forEach((fr) => {
                fr.removeRow();
            })
        }
    }

    updateAvailableFiltersOfRows() {
        this.model.filterRows.forEach((fr) => {
            if (fr.model.currentIndicatorValue !== 'All indicators' && this.model.dataFilterModel.groupLookup[fr.model.currentIndicatorValue] === undefined) {
                //the category is removed - remove the filter too
                const isDefault = fr.model.isDefault;
                fr.removeRow();

                if (isDefault) {
                    this.addEmptyFilter(true, false);
                }
            } else if (fr.model.currentIndicatorValue !== 'All values') {
                let lastIndex = fr.model.indicatorValues.length - 1;
                fr.updateIndicatorDropdowns(fr.model, lastIndex);
            }
        })
    }

    setAddFilterButton() { // TODO write an unselected filters getter in the data model
        if (this.model.dataFilterModel.availableFilters.length > 0)
            this.addFilterButton.enable();
        else
            this.addFilterButton.disable();
    }
}
