import {Dropdown, DropdownModel} from "./dropdown";
import {Component, Observable} from "../utils";
import {SidePanels} from "../elements/side_panels";
import {LockFilterButtonWrapper} from "./lock_filter_button/lock_filter_button_wrapper";
import {isArray, isEqual, isString} from "lodash";

/**
 *
 */
class FilterRowModel extends Component {
    static EVENTS = {
        updated: 'filterRowModel.updated',  // triggered when new datafiltermodel is set
        indicatorSelected: 'filterRowModel.indicatorSelected'
    }

    static ALL_VALUES = 'All values';
    static ALL_INDICATORS = 'All indicators';

    constructor(parent,
                dataFilterModel,
                isDefault,
                isExtra,
                isRequired,
                isPreviouslySelected,
                filterPanel = SidePanels.PANELS.dataMapper,
                defaultIndicatorText = FilterRowModel.ALL_INDICATORS,
                defaultSubindicatorText = FilterRowModel.ALL_VALUES
    ) {
        super(parent)
        this._isDefault = isDefault;
        this._isExtra = isExtra;
        this._isRequired = isRequired;
        this._isUnavailable = false;
        this._currentIndicatorValue = null;
        this._currentSubindicatorValue = [];
        this._defaultIndicatorText = defaultIndicatorText;
        this._defaultSubindicatorText = defaultSubindicatorText
        this._dataFilterModel = null;
        this._filterPanel = filterPanel;
        this._isPreviouslySelected = isPreviouslySelected;
        this.dataFilterModel = dataFilterModel;
        this._drillDownGroup = dataFilterModel.drillDownGroup;

    }

    get dataFilterModel() {
        return this._dataFilterModel;
    }

    get indicatorValues() {
        /**
         * Returns the available indicatorValues or [] if none are available
         */
        if (this.dataFilterModel != null) {
            let indicatorValues = [FilterRowModel.ALL_VALUES].concat(this.dataFilterModel.availableFilterNames);
            if (this.currentIndicatorValue !== FilterRowModel.ALL_INDICATORS && this.currentIndicatorValue !== FilterRowModel.ALL_VALUES) {
                indicatorValues.push(this.currentIndicatorValue);
            }
            return indicatorValues;
        }
        return []
    }

    get subindicatorValues() {
        /**
         * Returns the subindicator values for the currently selected indicatorValue. Returns [] if this is not possible
         */
        if (this.dataFilterModel != null) {
            if (this._currentIndicatorValue != null && this.dataFilterModel.groupLookup[this._currentIndicatorValue] != undefined)
                return this.dataFilterModel.groupLookup[this._currentIndicatorValue].values;
        }

        return [];
    }

    get isDefault() {
        return this._isDefault;
    }

    get isExtra() {
        return this._isExtra;
    }

    get isRequired() {
        return this._isRequired;
    }

    get isUnavailable() {
        /**
         * when a site-wide filter is not available
         */
        return this._isUnavailable;
    }

    set isUnavailable(value) {
        this._isUnavailable = value;
        }

    get isPreviouslySelected() {
        return this._isPreviouslySelected;
    }

    set isPreviouslySelected(value) {
        this._isPreviouslySelected = value;
    }

    get currentIndicatorValue() {
        /**
         * Return the currently selected indicatorValue or defaultText if none is selected
         */
        if (this._currentIndicatorValue == null)
            return this._defaultIndicatorText;
        return this._currentIndicatorValue;
    }

    set currentIndicatorValue(value) {
        /**
         * Sets the currently selected indictorValue and updates the dataFilterModel. Also triggers
         * an indicatorSelected event
         */

        let prevIndicator = this._currentIndicatorValue;
        let updateShareUrl = false;
        this._currentIndicatorValue = value;

        if (prevIndicator != null && prevIndicator !== FilterRowModel.ALL_VALUES && !this.isUnavailable) {
            this.dataFilterModel.removeFilter(prevIndicator);
            updateShareUrl = true;
        }

        if (value != null && value !== undefined && value !== FilterRowModel.ALL_VALUES) {
            this.dataFilterModel.addFilter(value, this._filterPanel);
        }
        if (!this.isRequired) {
            // no need to filter data before the subIndicator value is selected if isRequired = true
            this.dataFilterModel.updateFilteredData(updateShareUrl);
        }

        this.triggerEvent(FilterRowModel.EVENTS.indicatorSelected, this);
    }


    get currentSubindicatorValue() {
        /**
         * Returns the currently selected subindicatorValue or defaultSubindicatorText if none is selected
         */
        if (this._currentSubindicatorValue?.[0] === undefined )
            return this._defaultSubindicatorText;
        return this._currentSubindicatorValue;
    }

    set currentSubindicatorValue(value) {
        if (!isEqual(this._currentSubindicatorValue, value)) {
            this._currentSubindicatorValue = value;
            if (value !== undefined) {
                this.dataFilterModel.setSelectedSubindicator(this.currentIndicatorValue, value);
            }

            let updateSharedUrl = value !== undefined && !this.isPreviouslySelected;
            this.dataFilterModel.updateFilteredData(updateSharedUrl=updateSharedUrl);
            this.triggerEvent(FilterRowModel.EVENTS.updated, this);
        }
    }


    set dataFilterModel(dataFilterModel) {
        this._dataFilterModel = dataFilterModel;
        this._currentIndicatorValue = null;
        this._currentSubindicatorValue = [];

        this.triggerEvent(FilterRowModel.EVENTS.updated, this)
    }

    get drillDownGroup(){
      return this._drillDownGroup;
    }
}

/**
 * A widget that is comprised of two related dropdowns
 * The values in the second dropdown depend on the values selected value of the first dropdown
 *
 * TODO - should isDefault and isExtra be stored here instead of the parent widget?
 */
export class FilterRow extends Component {
    static EVENTS = {
        removed: 'filterRow.removed',
        indicatorOrSubIndicatorSelected: 'filterRow.indicatorOrSubIndicatorSelected'
    }

    static SELECT_ATTRIBUTE = 'Select an attribute';
    static SELECT_VALUE = 'Select a value';

    constructor(parent, container, dataFilterModel = null, isDefault = false, isExtra = true, isRequired = false, isPreviouslySelected = false, elements) {
        super(parent);
        this._container = container;
        this._elements = elements;

        this.prepareDomElements();
        this._model = new FilterRowModel(this, dataFilterModel, isDefault, isExtra, isRequired, isPreviouslySelected, elements.filterPanel);

        if (this.model.isDefault)
            this.hideRemoveButton();
        else {
            this.showRemoveButton();
        }
        this.indicatorDropdown = new Dropdown(this, this._indicatorDd, this.model.indicatorValues, FilterRow.SELECT_ATTRIBUTE, false, false, this.model.drillDownGroup);
        this.subIndicatorDropdown = new Dropdown(this, this._subindicatorDd, this.model.subindicatorValues, FilterRow.SELECT_VALUE, true);

        this.prepareEvents();
    }

    get model() {
        return this._model;
    }

    get container() {
        return this._container;
    }

    get lockFilterButton() {
        return this._lockFilterButton;
    }

    formatValue(value) {
      if (isArray(value)){
        return value;
      }
      return isString(value) ? value.split(",") : [value];
    }


    setPrimaryIndexUsingValue(value) {
        this.indicatorDropdown.model.currentItem = this.formatValue(value);
    }

    setSecondaryIndexUsingValue(value) {
        this.subIndicatorDropdown.model.currentItem = this.formatValue(value);
    }

    setPrimaryIndex(index) {
        let value = this.model.indicatorValues[index];
        this.indicatorDropdown.model.currentValue = this.formatValue(value);
    }

    setSecondaryIndex(index) {
        let value = [this.model.subindicatorValues[index]];
        this.subIndicatorDropdown.model.currentValue = this.formatValue(value);
    }

    setPrimaryValueUnavailable(value) {
        this.model._currentIndicatorValue = value;
        this.indicatorDropdown.model.isUnavailable = true;
        this.indicatorDropdown.setText(value);
    }

    setSecondaryValueUnavailable(value) {
        this.model._currentSubindicatorValue = [value];
        this.subIndicatorDropdown.model.isUnavailable = true;
        this.subIndicatorDropdown.setText(value);
    }

    prepareDomElements() {
        if (this._elements.addLockButton) {
            this.addLockButton();
        }
        $(this.container).attr('data-isextra', this._isExtra);
        $(this.container).attr('data-isdefault', this._isDefault);
        this._removeFilterButton = $(this.container).find(this._elements.removeFilterButton);
        this._removeFilterButton.addClass("remove-filter-row")

        this._indicatorDd = $(this.container).find(this._elements.filterDropdown)[0];
        this._subindicatorDd = $(this.container).find(this._elements.filterDropdown)[1];
        $(this.container).addClass("filter-container");
        $(this.container).find("div").first().after(
          "<span class='filter-divider'>:</span>"
        )
    }

    addLockButton() {
        $(this.container).find('.lock-filter-button-wrapper').remove();
        this._lockFilterButton = new LockFilterButtonWrapper(this);
    }


    prepareEvents() {
        this.prepareModelEvents();
        this.prepareUIEvents();
    }

    prepareModelEvents() {
        const self = this;

        this.model.on(FilterRowModel.EVENTS.updated, model => {
            self.updateIndicatorDropdowns(model);
        })

        this.indicatorDropdown.model.on(DropdownModel.EVENTS.selected, dropdownModel => {
            self.onIndicatorSelected(dropdownModel.currentItem);
        })

        this.subIndicatorDropdown.model.on(DropdownModel.EVENTS.selected, dropdownModel => {
            if (dropdownModel.manualTrigger){
              this.model.isPreviouslySelected = false;
            }
            self.onSubindicatorSelected(dropdownModel.currentItem);
        })

        this.model.on(FilterRowModel.EVENTS.indicatorSelected, model => {
            if (model.currentIndicatorValue !== FilterRowModel.ALL_VALUES) {
                self.updateSubindicatorDropdown();
            }
        })
    }

    prepareUIEvents() {
        const self = this;

        this._removeFilterButton.on('click', () => {
            self.removeRow();
        })
    }

    onIndicatorSelected(selectedItem) {
        this.subIndicatorDropdown.model.currentValue = undefined;
        if (selectedItem?.[0] === FilterRowModel.ALL_VALUES) {
            this.subIndicatorDropdown.disable();
        } else {
            this.subIndicatorDropdown.enable();
        }

        const currentValue = selectedItem?.[0];

        this.model.currentIndicatorValue = currentValue;
        this.subIndicatorDropdown.model.isMultiselect = (
          currentValue !== undefined && currentValue !== null &&
          currentValue === this.model.drillDownGroup
        )

        this.setLockButtonVisibility();
    }

    onSubindicatorSelected(selectedItem) {
        this.model.currentSubindicatorValue = selectedItem;
        this.setLockButtonVisibility();
    }

    setLockButtonVisibility() {
        this.triggerEvent(FilterRow.EVENTS.indicatorOrSubIndicatorSelected, {
            selectedIndicator: this.model.currentIndicatorValue !== FilterRowModel.ALL_INDICATORS,
            selectedSubIndicator: this.model.currentSubindicatorValue?.[0] !== FilterRowModel.ALL_VALUES
        });
    }

    updateIndicatorDropdowns(model, currentIndex = 0) {
        this.indicatorDropdown.updateItems(model.indicatorValues, currentIndex);
    }

    updateSubindicatorDropdown() {
        this.subIndicatorDropdown.updateItems(this.model.subindicatorValues);
        this.subIndicatorDropdown.currentItem = this.model.currentSubindicatorValue;
        this.subIndicatorDropdown.model.isDisabled = false;
    }

    hideRemoveButton() {
        this._removeFilterButton.addClass('is--hidden');
    }

    showRemoveButton() {
        this._removeFilterButton.removeClass('is--hidden');
    }

    removeRow() {
        this.model.currentIndicatorValue = null;
        $(this.container).remove();
        this.model.dataFilterModel.updateFilteredData();
        this.triggerEvent(FilterRow.EVENTS.removed, this);
    }
}
