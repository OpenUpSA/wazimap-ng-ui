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
        this._addFilterButton = new AddFilterButton(this, this.elements);
        this._filterCallback = null;

        this.prepareDomElements();
        this.prepareEvents();
    }

    get model() {
        return this._model;
    }

    get container() {
        return $($('.point-filters')[0]).find('.point-filters_content');
    }

    get addFilterButton() {
        return this._addFilterButton;
    }

    get elements() {
        return {
            removeFilterButton: '.point-filters__remove-filter',
            addButton: '.point-filters__add-filter',
            filterDropdown: '.point-filters__filter',
            filterRowClass: '.map-options__filter-row'
        }
    }

    get filterCallback() {
        return this._filterCallback;
    }

    set filterCallback(filterCallback) {
        this._filterCallback = filterCallback;
    }

    prepareDomElements() {
        this._rowContainer = $('.point-filters').find('.point-filters__filter-row')[0];
        $(this._rowContainer).hide();
    }

    prepareEvents() {
        const self = this;
        this.addFilterButton.on(AddFilterButton.EVENTS.clicked, () => {
            self.addEmptyFilter()
        })
    }

    addEmptyFilter(isDefault = false, isExtra = true) {
        if (this.model.dataFilterModel.availableFilters.length > 0) {
            const self = this;

            let filterRowContainer = self._rowContainer.cloneNode(true);
            $(filterRowContainer).show();

            let filterRow = new FilterRow(self, filterRowContainer, this.model.dataFilterModel, isDefault, isExtra, self.elements);
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
        })

        this.addEmptyFilter(true, false);
    }

    updateDataFilterModel(dataFilterModel) {
        this.model.dataFilterModel.groups = dataFilterModel.groups;
        this.model.dataFilterModel.childData = dataFilterModel.childData;

        this.updateAvailableFiltersOfRows();
        this.model.dataFilterModel.updateFilteredData();
    }

    updateAvailableFiltersOfRows() {
        this.model.filterRows.forEach((fr) => {
            if (fr.model.currentIndicatorValue !== 'All indicators' && this.model.dataFilterModel.groupLookup[fr.model.currentIndicatorValue] === undefined) {
                //the category is removed - remove the filter too
                console.log('remove row')
                fr.setPrimaryIndexUsingValue('All values');
            } else if (fr.model.currentIndicatorValue !== 'All values') {
                let lastIndex = fr.model.indicatorValues.length - 1;
                fr.updateIndicatorDropdowns(fr.model, lastIndex);
            }
        })
    }
}