import React, {useEffect, useState} from "react";
import {TreeItem, TreeView} from "@mui/lab";
import {CategoryTreeItem, ThemeTreeItem} from "./styled_elements";

const PointMapperTreeview = (props) => {
    const renderCategories = (categories) => {
        return categories.map(category => {
            return (
                <CategoryTreeItem
                    nodeId={`category-${category.id}`}
                    key={category.id}
                    label={category.name}
                >
                </CategoryTreeItem>
            )
        })
    }

    const renderThemes = () => {
        return props.themes.map(theme => {
            return (
                <ThemeTreeItem
                    nodeId={`theme-${theme.id}`}
                    key={theme.id}
                    label={theme.name}
                    icon={
                        <i
                            className={'material-icons'}
                            style={{color: `${theme.color}`}}
                        >
                            {theme.icon}
                        </i>
                    }
                    defaultExpandIcon={'a'}
                    defaultCollapseIcon={'b'}
                >
                    {renderCategories(theme.categories)}
                </ThemeTreeItem>
            )
        })
    }

    const renderTreeview = () => {
        console.log({'themes': props.themes})
        return (
            <TreeView
            >
                {renderThemes()}
            </TreeView>
        )
    }

    return (
        <div>{renderTreeview()}</div>
    )
}

export default PointMapperTreeview;