import React, {useState} from "react";
import {Autocomplete, Box, Card, Grid, Icon, TextField} from "@mui/material";
import Button from '@mui/material/Button';

import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';

const Dropdown = ({
  value,
  label,
  items,
  isDisabled,
  dropdownType,
  handleDropdownChange
}) => {

    return (
      <FormControl fullWidth disabled={isDisabled}>
        <InputLabel id="demo-simple-select-label">{dropdownType}</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={value}
          label={label}
          onChange={handleDropdownChange}
        >
          {items.length > 0 && items.map(
            (item, index) => <MenuItem value={item} key={index}>{item}</MenuItem>
          )}
        </Select>
      </FormControl>
    );
}

export default Dropdown;
