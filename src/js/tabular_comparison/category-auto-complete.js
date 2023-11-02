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
