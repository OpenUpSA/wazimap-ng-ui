import React from "react";
import {Chip} from "@mui/material";
import {StyledAutocomplete, StyledTextField} from "./styled-elements";

const KeywordSearch = (props) => {
    return (
        <StyledAutocomplete
            multiple
            options={[]}
            freeSolo
            size={'small'}
            renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                    <Chip variant="outlined" label={option} {...getTagProps({index})} />
                ))
            }
            renderInput={(params) => (
                <StyledTextField
                    {...params}
                    size={'small'}
                />
            )}
        />
    )
}

export default KeywordSearch;