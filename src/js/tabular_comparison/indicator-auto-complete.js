import React from "react";
import {Autocomplete, Box, TextField} from "@mui/material";

const IndicatorAutoComplete = (props) => {
    return (
        <Autocomplete
            disabled={props.disabled}
            isOptionEqualToValue={(option => true)}
            options={props.options}
            getOptionLabel={(option) => option}
            onChange={(event, selectedValue) => props.handleIndicatorSelection(event, selectedValue)}
            size={'small'}
            data-testid={'indicator-autocomplete'}
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
                    label={'Indicator'}
                />}
        />
    );
}

export default IndicatorAutoComplete;
