import React, {useState} from "react";
import {TreeView} from "@mui/lab";
import Theme from "./theme";

const PointMapperTreeview = (props) => {
    const [expanded, setExpanded] = useState([]);

    const renderThemes = () => {
        return props.themes.map(theme => {
            return (
                <Theme
                    theme={theme}
                />
            )
        })
    }

    const handleTreeViewToggle = (event, nodeIds) => {
        if (event.target.localName === 'input') {
            // switch toggled
            return;
        }
        setExpanded(nodeIds);
    }

    const renderTreeview = () => {
        return (
            <TreeView
                disableSelection={true}
                expanded={expanded}
                onNodeToggle={handleTreeViewToggle}
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