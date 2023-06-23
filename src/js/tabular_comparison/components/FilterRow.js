import React, {useState, useCallback, useMemo} from "react";
import {Autocomplete, Box, Card, Grid, Icon, TextField} from "@mui/material";
import Button from '@mui/material/Button';

import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Dropdown from './dropdown';
import IconButton from '@mui/material/IconButton';

const FilterRow = ({
  selectedGroup,
  canRemove,
  selectedValue,
  availableGroups,
  updateSelectedFilters,
  selectedGroupValues,
  removeFilterRow,

}) => {
    const handleGroupDropdownChange = useCallback(
      (event) => {
        updateSelectedFilters(
            selectedGroup,
            {group: event.target.value, value: '', canRemove: canRemove}
        )
      }
    );

    const handleValueDropdownChange = useCallback(
      (event) => {
        updateSelectedFilters(
            selectedGroup,
            {group: selectedGroup, value: event.target.value, canRemove: canRemove}
        )
      }
    );

    const groups = useMemo(
      () => {
        let presentGroups = selectedGroup.length > 0 ? [selectedGroup] : [];
        return (
          availableGroups.length > 0 ?
            [...presentGroups, ...availableGroups]:
            presentGroups
        );
      }, [availableGroups]
    )

    return (
      <Grid container item={true} spacing={2}>
        <Grid xs={5} item={true}>
          <Dropdown
            items={groups}
            label="Group"
            dropdownType="attribute"
            value={selectedGroup}
            isDisabled={!canRemove}
            handleDropdownChange={handleGroupDropdownChange}
          />
        </Grid>
        <Grid xs={5} item={true}>
          <Dropdown
            items={selectedGroupValues || []}
            label="Value"
            dropdownType="value"
            value={selectedValue}
            handleDropdownChange={handleValueDropdownChange}
          />
        </Grid>

        <Grid xs={2} item={true} alignItems="center" justifyContent="center">
        {canRemove &&
          <IconButton aria-label="delete" size="small" onClick={() => removeFilterRow(selectedGroup)}>
            X
          </IconButton>
        }
        </Grid>
      </Grid>
    );
}

export default FilterRow;
