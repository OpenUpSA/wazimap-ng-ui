import {Component, Observable} from "../utils";

import React from 'react';
import {createRoot} from 'react-dom/client';
import {FilterDropdown} from './filter_dropdown/dropdown';

import {isArray, isEqual} from "lodash";


export class DropdownModel extends Observable {
    static EVENTS = {
        update: 'DropdownModel.update',     // triggered when new items are added or removed
        selected: 'DropdownModel.selected', // triggered when a new item is selected
        enabled: 'DropdownModel.enabled',   // triggered when the dropdown is set to enabled
        disabled: 'DropdownModel.disabled', // triggered when the dropdown is set to disabled
        unavailable: 'DropdownModel.unavailable',   // triggered when the dropdown is set to unavailable
        available: 'DropdownModel.available', // triggered when the dropdown is set to available
        enableMultiselect: 'DropdownModel.enableMultiselect'
    }

    constructor(items = [], isMultiselect = false, currentValue = [], isDisabled = false, isUnavailable = false, isUpdatable = true) {
        super();

        this._items = items;
        this._isDisabled = isDisabled;
        this._isUnavailable = isUnavailable;
        this._manualTrigger = false;
        this._isMultiselect = isMultiselect;
        this._unavailableValue = undefined;
        this._isUpdatable = isUpdatable;
    }

    get items() {
        return this._items;
    }

    get currentValue() {
        return this._currentValue;
    }

    set currentValue(value) {
        if (this.isUpdatable) {
            this._currentValue = value;
            this.triggerEvent(DropdownModel.EVENTS.selected, this);
        } else {
            this.triggerEvent(DropdownModel.EVENTS.selected, value);
        }
    }

    get currentItem() {
        return this.currentValue
    }

    set currentItem(value) {
        if (value === [] || value === undefined || value === '') {
            this.currentValue = value;
            return;
        }

        const isSubsetResult = value.every(item => this.items.includes(item));
        if (isSubsetResult) {
            this.currentValue = value;
            return;
        }

        throw `Did not find value: ${value} in dropdown items`;
    }

    get isDisabled() {
        return this._isDisabled;
    }

    set isDisabled(flag) {
        this._isDisabled = flag;

        if (flag) {
            this.triggerEvent(DropdownModel.EVENTS.disabled);
        } else {
            this.triggerEvent(DropdownModel.EVENTS.enabled);
        }
    }

    get isUnavailable() {
        return this._isUnavailable;
    }

    set unavailableValue(value) {
        return this._unavailableValue = value;
    }

    get unavailableValue() {
        return this._unavailableValue;
    }

    set isUnavailable(value) {
        if (value) {
            this.isDisabled = true;
            this._isUnavailable = true;
            this._unavailableValue = value;
            this.triggerEvent(DropdownModel.EVENTS.unavailable, value)
        } else {
            this.triggerEvent(DropdownModel.EVENTS.available);
        }
    }

    get manualTrigger() {
        return this._manualTrigger;
    }

    set manualTrigger(val) {
        this._manualTrigger = val;
    }

    get isMultiselect() {
        return this._isMultiselect;
    }

    set isMultiselect(value) {
        this._isMultiselect = value;
        this.triggerEvent(DropdownModel.EVENTS.enableMultiselect, this);
    }

    get isUpdatable() {
        return this._isUpdatable;
    }

    set isUpdatable(value) {
        this._isUpdatable = value;
    }

    getIndexForValue(value) {
        return this.items.indexOf(value);
    }

    setIndexUsingValue(value) {
        this.currentValue = values;
    }

    updateItems(items, currentIndex = 0) {
        this._items = items;
        this.triggerEvent(DropdownModel.EVENTS.update, this);
    }
}

export class Dropdown extends Component {
    /**
     * A class representing a dropdown widget
     */

    static EVENTS = {
        updateItems: "Dropdown.updateItems"
    }

    constructor(parent, container, items, defaultText = '', disabled = false, isMultiselect = false, drillDownOption = '', root = null, isUpdatable = true) {
        super(parent);
        this._container = container;
        this._model = new DropdownModel(items, isMultiselect, 0, false, false, isUpdatable);
        this._defaultText = defaultText;
        this._listItemElements = [];
        this._manualTrigger = false;
        this._root = root;

        this.prepareDomElements();
        this.prepareEvents();

        this.redrawItems(this.model.items);
        this.model.isDisabled = disabled;
        this.model._isUnavailable = false;

        this._isMultiselect = this.model.isMultiselect;
        this._drillDownOption = drillDownOption;

    }

    get container() {
        return this._container;
    }

    get model() {
        return this._model;
    }

    get drillDownOption() {
        return this._drillDownOption;
    }

    get root() {
        return this._root;
    }

    set root(value) {
        this._root = value;
    }

    prepareDomElements() {
        if (this.root == null) {
            this.root = createRoot(this._container);
        }
        this.root.render(<FilterDropdown
            label={this._defaultText}
            dropdownElement={this}
            drillDownOption={this.drillDownOption}
        />)
    }

    prepareEvents() {
        this.prepareModelEvents();
    }

    prepareModelEvents() {
        const self = this;

        this.model.on(DropdownModel.EVENTS.update, model => {
            self.redrawItems(model.items);
        })

        this.model.on(DropdownModel.EVENTS.disabled, () => self.disable())
        this.model.on(DropdownModel.EVENTS.enabled, () => self.enable())
    }


    showItems() {
        $(this._ddWrapper).show()
    }

    hideItems() {
        $(this._ddWrapper).hide()
    }

    updateItems(items, currentIndex = 0) {
        this.model.updateItems(items, currentIndex);
    }

    reset() {
        this._listItemElements.forEach(el => {
            $(el).remove();
        })

        this._listItemElements = [];
    }

    enable() {
        $(this._trigger).removeClass('is--disabled');
        $(this.container).removeClass('disabled');
    }

    disable() {
        $(this._trigger).addClass('is--disabled');
        $(this.container).addClass('disabled');
    }

    setAvailable() {
        $(this._trigger).css('text-decoration', 'unset');
    }

    setUnavailable() {
        $(this._trigger).css('text-decoration', 'line-through');
    }

    redrawItems(items, currentIndex = 0) {
        this.triggerEvent(Dropdown.EVENTS.updateItems, {items});
    }
}
