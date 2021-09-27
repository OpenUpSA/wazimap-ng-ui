import {Component, Observable} from "../../utils";
import {FilterRow} from "../../ui_components/filter_row";
import {AddFilterButton} from "../../ui_components/add_filter_button";
import {DataFilterModel} from "../../models/data_filter_model";

class FilterControllerModel extends Observable {
    constructor(dataModelFilter) {
        super();
        this._filterRows = [];
        this._dataFilterModel = dataModelFilter;
    }

    get availableFilters() {
        return ['aaa'];
    }

    addFilterRow(filterRow) {
        this._filterRows.push(filterRow);
    }
}

export class FilterController extends Component {
    constructor(parent) {
        super(parent);

        this._model = new FilterControllerModel();
        this._addFilterButton = new AddFilterButton(this, this.elements);

        this.prepareDomElements();
        this.prepareEvents();
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

    addEmptyFilter(isDefault = false, isExtra = true) {
        if (this.model.availableFilters.length > 0) {
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

    setDataFilterModel(dataFilterModel) {
        this.model.dataFilterModel = dataFilterModel;

        this.model.dataFilterModel.on(DataFilterModel.EVENTS.updated, () => {
            console.log('data filtered');
        })

        this.addEmptyFilter(true, false);
    }
}