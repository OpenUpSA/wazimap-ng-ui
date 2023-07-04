import React, {useState, useCallback, useMemo} from "react";
import {Autocomplete, Box, Card, Grid, Icon, TextField} from "@mui/material";
import Button from '@mui/material/Button';

import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Dropdown from './dropdown';

import {RemoveFilterButton} from './styledElements';
import {RemoveFilterSvg} from '../svg-icons';

const FilterRow = ({
  index,
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
      <Grid container item={true} spacing={2} className={'lh-0'}>
      <Grid xs={2} item={true} className={'m-auto'}>
        <p className={'font-13'}>Filter {index+1}:</p>
      </Grid>
        <Grid xs={4} item={true} className={'m-auto'}>
          <Dropdown
            items={groups}
            label="Group"
            placeholder="attribute"
            value={selectedGroup}
            isDisabled={!canRemove}
            handleDropdownChange={handleGroupDropdownChange}
          />
        </Grid>
        <Grid xs={4} item={true} className={'m-auto'}>
          <Dropdown
            items={selectedGroupValues || []}
            label="Value"
            placeholder="value"
            value={selectedValue}
            isDisabled={selectedGroup === ''}
            handleDropdownChange={handleValueDropdownChange}
          />
        </Grid>

        <Grid xs={2} item={true} alignItems="center" className={'m-auto'}>
        {canRemove &&
          <RemoveFilterButton aria-label="delete" size="small" onClick={() => removeFilterRow(selectedGroup)}>
            {RemoveFilterSvg}
          </RemoveFilterButton>
        }
        </Grid>
      </Grid>
    );
}

export default FilterRow;
