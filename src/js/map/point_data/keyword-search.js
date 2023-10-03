import React from "react";
import {StyledAutocomplete, StyledTextField, StyledChip} from "./styled-elements";

const KeywordSearch = (props) => {
    const handleAutocompleteChange = (event, newValue) => {
       props.pointFilter.keywordSearchOptions = newValue;
    };
    return (
        <StyledAutocomplete
            multiple
            options={[]}
            freeSolo
            size={"small"}
            renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                    <StyledChip size={"small"} label={option} {...getTagProps({index})} />
                ))
            }
            onChange={handleAutocompleteChange}
            renderInput={(params) => (
                <StyledTextField
                    {...params}
                    size={"small"}
                />
            )}
        />
    )
}

export default KeywordSearch;