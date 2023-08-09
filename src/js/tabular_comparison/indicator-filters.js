import React, {useCallback, useMemo} from "react";
import {Grid} from "@mui/material";

import FilterRow from './components/filter_row';
import {AddFilterButton} from './components/styledElements';

const IndicatorFilters = ({
  indicator,
  selectedFilters,
  setSelectedFilters,
}) => {
    const metadata = indicator.indicatorDetail.metadata;
    const primaryGroup = metadata.primary_group;
    const groups = metadata.groups.filter(item => item.name !== primaryGroup);

    const updateSelectedFilters = useCallback(
      (currentGroupName, updatedFilter) => {
        const newFilters = selectedFilters.map(
          (item) => {
            if (item.group === currentGroupName){
              return updatedFilter;
            }
            return item;
          }
        )
        setSelectedFilters(newFilters);
      }, [
        selectedFilters
      ]
    )

    const removeFilterRow = useCallback(
      (groupName) => {
        const newFilters = selectedFilters.filter(
          (item) => item.group !== groupName
        )
        setSelectedFilters(newFilters);
      }, [
        selectedFilters
      ]
    )

    const isExtraFilterAdded = useMemo(
      () => {
        return selectedFilters.find(
          item => item.group.length === 0 || item.value.length === 0
        ) !== undefined;
      }, [selectedFilters]
    )

    const availableGroups = useMemo(
      () => {
        const selectedGroups = selectedFilters.map(item => item.group);
        const allGroups = groups.map(item => item.name);
        return allGroups.filter(item => !selectedGroups.includes(item));
      }, [
        selectedFilters, groups
      ]
    )

    const getSelectedGroupValues = useCallback(
      (groupName) => {
        const filteredGroup = groups.find(item => item.name === groupName);
        return filteredGroup !== undefined ? filteredGroup.subindicators : [];
      }, [
        groups, selectedFilters
      ]
    )

    const onClickingAddFilters = useCallback(
      () => {

        if (!isExtraFilterAdded && availableGroups.length > 0){
          setSelectedFilters([
            ...selectedFilters,
            {
              group: '',
              value: '',
              canRemove: true
            }
          ]);
        }

      }, [selectedFilters, isExtraFilterAdded, availableGroups]
    )


    return (
        <div>
          <Grid container>
            {selectedFilters && selectedFilters.map((filter, index) => (
              <FilterRow
                key={index}
                index={index}
                selectedGroup={filter.group}
                selectedValue={filter.value}
                canRemove={filter.canRemove}
                availableGroups={availableGroups}
                selectedGroupValues={getSelectedGroupValues(filter.group)}
                updateSelectedFilters={updateSelectedFilters}
                removeFilterRow={removeFilterRow}
              />
            ))}
            <Grid xs={12} item={true}>
              <AddFilterButton onClick={onClickingAddFilters} data-testid="add-filter">
                Add a Filter
              </AddFilterButton>
            </Grid>
          </Grid>
        </div>
    );
}

export default IndicatorFilters;
