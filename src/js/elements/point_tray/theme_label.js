import React from "react";
import {Grid} from "@mui/material";
import {AntSwitch, TextTruncatingGrid} from "./styled_elements";

const ThemeLabel = (props) => {
    const handleThemeSelection = (event, checked) => {
        event.stopPropagation();
        event.nativeEvent.stopImmediatePropagation();

        props.themeToggled(props.theme, checked);
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

    const renderSwitch = () => {
        if (props.isThemeLoading) {
            return (
                <i
                    className={'fa fa-duotone fa-spinner fa-spin'}
                />
            )
        } else {
            return (
                <AntSwitch
                    onChange={handleThemeSelection}
                    checked={props.isThemeSelected}
                />
            )
        }
    }

    return (
        <Grid
            container
            alignItems={'center'}
        >
            <TextTruncatingGrid
                item
                sm={8}
            >{props.theme.name}</TextTruncatingGrid>
            <Grid
                item
                container
                sm={4}
                alignItems={'center'}
            >
                <Grid
                    item
                    sm={9}
                    sx={{textAlign: 'center', height: '20px'}}
                >
                    {renderSwitch()}
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