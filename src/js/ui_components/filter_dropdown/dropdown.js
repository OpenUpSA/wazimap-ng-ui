import React, {useState, useCallback} from 'react';

import FormControl from '@mui/material/FormControl';
import {
  CustomSelect,
  FilterItem,
  FilterItemValueContainer,
  FilterItemIconContainer,
  DrillDownIconContainer,
  SelectedItem
} from './styledElements';
import Tooltip from '@mui/material/Tooltip';

import {isArray, isEqual} from "lodash";


const DrillDownSvg = () => (
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


export const FilterDropdown = ({
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
        return (
          <em>
            {selected}
            <DrillDownIconContainer>
              <DrillDownSvg/>
            </DrillDownIconContainer>
          </em>
        );
      }
      return isMultiselect ? selected.join(", ") : selected || '';
    }, [
      isMultiselect, drillDownOption
    ]
  )

  return (
    <FormControl fullWidth>
      <CustomSelect
        displayEmpty
        multiple={isMultiselect}
        value={isMultiselect ? selectedValue : selectedValue?.[0] || ''}
        onChange={handleSelectChange}
        renderValue={(selected) => getCurrentlySelectedValue(selected)}
      >
        {options.map((option, index) => (
          <FilterItem key={option} value={option} className={"filter-item"}>
          <FilterItemValueContainer>
            {option}
            <FilterItemIconContainer>
              {option === dropdownElement.drillDownOption && <DrillDownSvg />}
              {selectedValue.includes(option) && <SelectedItem/>}
            </FilterItemIconContainer>
          </FilterItemValueContainer>
          </FilterItem>
        ))}
      </CustomSelect>
    </FormControl>
  );
};
