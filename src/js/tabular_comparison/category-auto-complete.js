import {Autocomplete, Box, TextField} from "@mui/material";
import React from "react";

const CategoryAutoComplete = (props) => {
    return (
        <Autocomplete
            disabled={props.disabled}
            isOptionEqualToValue={(option => true)}
            options={
                props.selectedIndicator == null ? [] :
                    props.selectedIndicator.indicatorDetail.metadata.groups
                        .filter((x) => x.name === props.selectedIndicator.indicatorDetail.metadata.primary_group)[0].subindicators
            }
            getOptionLabel={(option) => option}
            getOptionDisabled={(option) => {
                let alreadySelected = props.indicatorObjs.filter(x => x.indicator === props.selectedIndicator.indicator && x.category === option)[0];

                return alreadySelected != null && alreadySelected.category !== props.categoryValue;
            }}
            size={'small'}
            value={props.categoryValue}
            onChange={(event, selectedValue) => props.handleCategorySelection(event, selectedValue)}
            data-testid={'category-autocomplete'}
            renderOption={(props, option) => (
                <Box
                    component="li"
                    {...props}
                >
                    {option}
                </Box>
            )}
            renderInput={(params) =>
                <TextField
                    {...params}
                    label={'Category'}
                />}
        />
    );
}

export default CategoryAutoComplete;
