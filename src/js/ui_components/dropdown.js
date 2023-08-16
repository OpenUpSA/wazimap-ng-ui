import {Component, Observable} from "../utils";

import React, {useEffect, useState, useMemo, useCallback} from 'react';
import {createRoot} from 'react-dom/client';

import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import {FilterDropdown, FilterItem} from './styledElements';
import CheckIcon from '@mui/icons-material/Check';
import Tooltip from '@mui/material/Tooltip';

import {isArray, isEqual} from "lodash";


export const DrillDownSvg = () => (
    <Tooltip
      title="This field allows selecting multiple values at the same time for comparison."
      arrow
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <g opacity="0.5">
          <path d="M8.74024 19L7.90024 18.0813L10.3202 15.4344H4.00024V14.1219H10.3202L7.90024 11.475L8.74024 10.5563L12.6002 14.7781L8.74024 19ZM15.2602 13.4438L11.4002 9.22188L15.2602 5L16.1002 5.91875L13.6802 8.56563H20.0002V9.87813H13.6802L16.1002 12.525L15.2602 13.4438Z" fill="#707070"/>
        </g>
      </svg>
    </Tooltip>
)


const DynamicSelect = ({
    label,
    dropdownElement,
    drillDownOption,
  }) => {
  const [selectedValue, setSelectedValue] = useState(dropdownElement.model.currentValue || []);
  const [isMultiselect, setIsMultiselect] = useState(dropdownElement.model.isMultiselect || false);
  const [options, setOptions] = useState(dropdownElement.model.items);
  const [startedListening, setStartedListening] = useState(false);

  if (!startedListening) {
      setStartedListening(true);
      dropdownElement.on('Dropdown.updateItems', payload => {
        setOptions(payload.items);
      });

      dropdownElement.model.on('DropdownModel.selected', payload => {
        setSelectedValue(payload.currentValue || []);
      });

      dropdownElement.model.on('DropdownModel.selected', payload => {
        setSelectedValue(payload.currentValue || []);
      });

      dropdownElement.model.on('DropdownModel.enableMultiselect', payload => {
        setIsMultiselect(payload.isMultiselect);
      });
  }

  const handleSelectChange = (event) => {
    dropdownElement.model.currentValue = isMultiselect ? event.target.value : [event.target.value];
  };

  const getCurrentlySelectedValue = useCallback(
    (selected) => {
      if (selected === '' || selected?.[0] === undefined) {
        return <em>{label}</em>;
      }

      const isDrillDownField = isArray(selected) ? selected.includes(dropdownElement.drillDownOption) : selected === dropdownElement.drillDownOption;

      if (isDrillDownField){
        return <em>{selected} <span style={{ float: 'right', height: '20px'}}><DrillDownSvg/></span></em>;
      }
      return isMultiselect ? selected.join(", ") : selected || '';
    }, [
      isMultiselect, drillDownOption
    ]
  )

  return (
    <FormControl fullWidth>
      <FilterDropdown
        displayEmpty
        multiple={isMultiselect}
        value={isMultiselect ? selectedValue : selectedValue?.[0] || ''}
        onChange={handleSelectChange}
        renderValue={(selected) => getCurrentlySelectedValue(selected)}
      >
        {options.map((option, index) => (
          <FilterItem key={option} value={option}>
          <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            {option}
            <Box sx={{ marginLeft: 'auto', fontSize: '16px' }}>
              {option === dropdownElement.drillDownOption && <DrillDownSvg />}
              {selectedValue.includes(option) && <CheckIcon sx={{fontSize: '14px', marginLeft: '5px', color: '#707070'}}/>}
            </Box>
        </div>
          </FilterItem>
        ))}
      </FilterDropdown>
    </FormControl>
  );
};



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

    constructor(items = [], isMultiselect = false, currentValue=[], isDisabled = false, isUnavailable = false) {
        super();

        this._items = items;
        // this._currentIndex = parseInt(currentIndex);
        this._isDisabled = isDisabled;
        this._isUnavailable = isUnavailable;
        this._manualTrigger = false;
        this._isMultiselect = isMultiselect;
    }

    get items() {
        return this._items;
    }

    get currentValue() {
        return this._currentValue;
    }

    set currentValue(value) {
        this._currentValue = value;
        this.triggerEvent(DropdownModel.EVENTS.selected, this)
    }

    get currentItem() {
        return this.currentValue
    }

    set currentItem(value) {
        if (value === [] || value === undefined || value === ''){
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

    set isUnavailable(value) {
        if (value) {
            this.isDisabled = true;
            this.triggerEvent(DropdownModel.EVENTS.unavailable);
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

    constructor(parent, container, items, defaultText = '', disabled = false, isMultiselect = false, drillDownOption = '') {
        super(parent);
        this._container = container;
        this._model = new DropdownModel(items, isMultiselect, 0);
        this._defaultText = defaultText;
        this._listItemElements = [];
        this._manualTrigger = false;

        this.prepareDomElements();
        this.prepareEvents();

        this.redrawItems(this.model.items);
        this.model.isDisabled = disabled;
        this.model.isUnavailable = false;
        this.setText(defaultText);

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

    prepareDomElements() {
        this.root = createRoot(this._container);
        this.root.render(<DynamicSelect
          label={this._defaultText}
          dropdownElement={this}
          drillDownOption={this.drillDownOption}
        />)
    }

    prepareEvents() {
        this.prepareModelEvents();
        this.prepareUIEvents();
    }

    prepareModelEvents() {
        const self = this;

        this.model.on(DropdownModel.EVENTS.update, model => {
            self.redrawItems(model.items);
        })

        this.model.on(DropdownModel.EVENTS.disabled, () => self.disable())
        this.model.on(DropdownModel.EVENTS.enabled, () => self.enable())

        this.model.on(DropdownModel.EVENTS.unavailable, () => self.setUnavailable())
        this.model.on(DropdownModel.EVENTS.available, () => self.setAvailable())
    }

    prepareUIEvents() {
        const self = this;

        $(this._trigger).on('click', () => {
            self.model.manualTrigger = true;
            self.showItems();
        })
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

    updateSelectedText() {
        this.setText(this.model.currentItem);
    }

    setSelected(value) {
        this.model.currentValue = value;
        this.setText(this.model.currentItem);
    }

    setText(text) {
        $(this._selectedItem).text(text)
    }

    getText() {
        return $(this._selectedItem).text();
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

    redrawItems(items, currentIndex=0) {
        this.triggerEvent(Dropdown.EVENTS.updateItems, {items});
    }
}
