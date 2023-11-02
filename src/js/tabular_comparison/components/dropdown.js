import React from "react";

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

import {FilterItem, FilterDropdown} from './styledElements';

const Dropdown = ({
  value,
  placeholder,
  label,
  items,
  isDisabled,
  dropdownType,
  handleDropdownChange
}) => {

    return (
      <FormControl fullWidth disabled={isDisabled} size="small">
        { dropdownType && <InputLabel id="demo-simple-select-label">{dropdownType}</InputLabel>}
        <FilterDropdown
          displayEmpty
          data-testid={`${label.toLowerCase()}-dropdown`}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={value}
          onChange={handleDropdownChange}
          renderValue={(selected) => {
            if (selected === '') {
              return <em>{placeholder}</em>;
            }

            return selected;
          }}
          inputProps={{ 'aria-label': 'Without label' }}
        >
          {items.length > 0 && items.map(
            (item, index) => <FilterItem value={item} key={index}>{item}</FilterItem>
          )}
        </FilterDropdown>
      </FormControl>
    );
}

export default Dropdown;
