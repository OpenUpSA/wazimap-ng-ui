import React from "react";
import {FormControl, MenuItem, Select, selectClasses} from "@mui/material";
import {styled} from "@mui/system";

const ViewSelect = (props) => {
    const [views, setViews] = React.useState(props.viewsArr);


    const StyledSelect = styled(Select)(() => ({
        [`& .${selectClasses.filled}`]: {
            paddingTop: '12px',
            fontSize: '0.9em',
            lineHeight: '1.2',
            color: '#666'
        },
        [`& .${selectClasses.icon}`]: {
            top: 'unset'
        }
    }));

    const StyledMenuItem = styled(MenuItem)(() => ({
        paddingTop: '12px',
        fontSize: '0.9em',
        lineHeight: '1.2',
        color: '#666'
    }));

    const handleChange = (event) => {
        setViews(event.target.value);
    };

    return (
        <FormControl fullWidth>
            <StyledSelect
                value={'age'}
                onChange={handleChange}
                size={'small'}
                variant={'filled'}
                disableUnderline
                IconComponent={(props) => (
                    <svg
                        {...props}
                        xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <path d="M0 0h24v24H0z" fill="none"></path>
                        <path fill="currentColor" d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"></path>
                    </svg>
                )}
            >
                {
                    views.map(view => (
                        <StyledMenuItem value={view}>{view}</StyledMenuItem>
                    ))
                }
            </StyledSelect>
        </FormControl>
    );
}

export default ViewSelect;