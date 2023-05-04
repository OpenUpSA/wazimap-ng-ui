import React from "react";
import {Grid} from "@mui/material";
import {AntSwitch} from "./styled_elements";

const ThemeLabel = (props) => {
    const handleThemeSelection = (event, checked) => {
        event.stopPropagation();
        event.nativeEvent.stopImmediatePropagation();

    }

    return (
        <Grid
            container
            alignItems={'center'}
        >
            <Grid
                item
                sm={8}
            >{props.theme.name}</Grid>
            <Grid
                item
                container
                sm={4}
                alignItems={'center'}
            >
                <Grid
                    item
                    sm={9}
                    sx={{textAlign: 'center'}}
                >
                    <AntSwitch
                        onChange={handleThemeSelection}
                    />
                </Grid>
                <Grid
                    item
                    sm={3}
                    sx={{textAlign: 'center'}}
                >
                    <i className={'fa-angle-down fas'} aria-hidden="true"/>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default ThemeLabel;