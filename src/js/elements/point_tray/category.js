import React from "react";
import {CategoryTreeItem} from "./styled_elements";

const Category = (props) => {
    const handleClick = (event) => {
        props.categoryToggled(props.category);
    }

    return (
        <CategoryTreeItem
            nodeId={`category-${props.category.id}`}
            key={props.category.id}
            label={props.category.name}
            onClick={handleClick}
        >
        </CategoryTreeItem>
    )
}

export default Category;