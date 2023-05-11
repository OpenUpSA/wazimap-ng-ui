import React from "react";
import {Grid} from "@mui/material";
import {AntSwitch} from "./styled_elements";

const ThemeLabel = (props) => {
    const handleThemeSelection = (event, checked) => {
        event.stopPropagation();
        event.nativeEvent.stopImmediatePropagation();
    }

    const renderArrowIcon = () => {
        if (props.isThemeExpanded) {
            return (
                <i className={'fa-angle-up fas'}/>
            )
        } else {
            return (
                <i className={'fa-angle-down fas'}/>
            )
        }
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
                        checked={props.isThemeSelected}
                    />
                </Grid>
                <Grid
                    item
                    sm={3}
                    sx={{textAlign: 'center'}}
                >
                    {renderArrowIcon()}
                </Grid>
            </Grid>
        </Grid>
    )
}

export default ThemeLabel;