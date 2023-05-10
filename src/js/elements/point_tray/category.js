import React from "react";
import {AntSwitch, CategoryTreeItem} from "./styled_elements";
import {Grid} from "@mui/material";

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
                    sx={{'visibility': props.category.isLoading ? 'visible' : 'hidden'}}
                >
                    <i className="fa-duotone fa-spinner fa-spin fa"/>
                </Grid>
            </Grid>
        )
    }

    return (
        <CategoryTreeItem
            nodeId={`category-${props.category.id}`}
            key={props.category.id}
            label={renderLabel()}
            onClick={handleClick}
        >
        </CategoryTreeItem>
    )
}

export default Category;