import React, {useEffect, useState} from 'react';
import {InputLabel, MenuItem, Select, FormControl, Box} from "@mui/material";

import './row.css'

const Row = (props) => {
    const [selected, setSelected] = useState(null);

    const handleChange = (e) => {
        const {name, value} = e.target;
        props.handleChange(value);
    }

    return (
        <Box sx={{minWidth: 284, marginTop: 2, marginLeft: 1.5}}>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label" className={'custom-dropdown-label'}>Select an
                    attribute</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Select an attribute"
                    onChange={handleChange}
                    className={'custom-dropdown'}
                >
                    <MenuItem className={'custom-dropdown-option'} value={'All values'}>All values</MenuItem>
                    <MenuItem className={'custom-dropdown-option'} value={'gender'}>gender</MenuItem>
                    <MenuItem className={'custom-dropdown-option'} value={'race'}>race</MenuItem>
                    <MenuItem className={'custom-dropdown-option'} value={'language'}>language</MenuItem>
                </Select>
            </FormControl>
        </Box>
    )
}

export default Row;