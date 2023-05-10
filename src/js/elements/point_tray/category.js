import React from "react";
import {CategoryTreeItem} from "./styled_elements";
import {Grid} from "@mui/material";
import {treeItemClasses} from "@mui/lab/TreeItem";
import {calculateThemeBackgroundColor} from "../../utils";

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
        <CategoryTreeItem
            nodeId={`category-${props.category.id}`}
            key={props.category.id}
            label={renderLabel()}
            onClick={handleClick}
            sx={{
                [`& .${treeItemClasses.content}`]: {
                    backgroundColor: props.category.isSelected ? calculateThemeBackgroundColor(props.category.theme.color) : '#f0f0f0'
                }
            }}
        >
        </CategoryTreeItem>
    )
}

export default Category;