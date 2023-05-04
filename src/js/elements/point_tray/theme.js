import React from "react";
import {ThemeTreeItem} from "./styled_elements";
import ThemeLabel from "./theme_label";
import Category from "./category";

const Theme = (props) => {

    const categoryToggled = (category) => {

    }

    const renderCategories = (categories) => {
        return categories.map(category => {
            return (
                <Category
                    category={category}
                    categoryToggled={categoryToggled}
                />
            )
        })
    }

    return (
        <ThemeTreeItem
            nodeId={`theme-${props.theme.id}`}
            key={props.theme.id}
            label={
                <ThemeLabel
                    theme={props.theme}
                />
            }
            icon={
                <i
                    className={'material-icons'}
                    style={{color: `${props.theme.color}`}}
                >
                    {props.theme.icon}
                </i>
            }
        >
            {renderCategories(props.theme.categories)}
        </ThemeTreeItem>
    )
}

export default Theme;