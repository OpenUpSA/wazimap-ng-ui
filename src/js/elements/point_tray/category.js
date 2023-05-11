import React from "react";
import {StyledTreeItem} from "./styled_elements";
import {Grid, ThemeProvider} from "@mui/material";

const Category = (props) => {
    const handleClick = (event) => {
        props.categoryToggled(props.category);
    }

    const renderLabel = () => {
        return (
            <Grid
                container
                alignItems={'center'}
            >
                <Grid
                    item
                    sm={11}
                >{props.category.name}</Grid>
                <Grid
                    item
                    container
                    sm={1}
                    alignItems={'center'}
                    sx={{'display': props.category.isSelected ? 'block' : 'none'}}
                >
                    <i
                        className={'fa fa-thin fa-check'}
                    />
                </Grid>
                <Grid
                    item
                    container
                    sm={1}
                    alignItems={'center'}
                    sx={{'display': props.category.isLoading ? 'block' : 'none'}}
                >
                    <i
                        className={'fa fa-duotone fa-spinner fa-spin'}
                    />
                </Grid>
            </Grid>
        )
    }

    return (
        <ThemeProvider theme={props.styleTheme}>
            <StyledTreeItem
                nodeId={`category-${props.category.id}`}
                key={props.category.id}
                label={renderLabel()}
                onClick={handleClick}
                className={props.category.isSelected ? 'selected' : ''}
            >
            </StyledTreeItem>
        </ThemeProvider>
    )
}

export default Category;