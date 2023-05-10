import React, {useState} from "react";
import {TreeView} from "@mui/lab";
import Theme from "./theme";

const PointMapperTreeview = (props) => {
    const [themes, setThemes] = useState(props.themes);
    const [startedListening, setStartedListening] = useState(false);
    const [expandedThemes, setExpandedThemes] = useState([]);

    if (!startedListening) {
        setStartedListening(true);

        props.parent.on('point_data.category.loading', category => {
            setCategoryLoadingState(category, true);
        });

        props.parent.on('point_data.category.loaded', category => {
            setCategorySelectedState(category, true);
            setCategoryLoadingState(category, false);
        });
    }

    const setCategorySelectedState = (category, isSelected) => {
        setCategoryProperty(category, 'isSelected', isSelected);
    }

    const setCategoryLoadingState = (category, isLoading) => {
        setCategoryProperty(category, 'isLoading', isLoading);
    }

    const setCategoryProperty = (category, key, value) => {
        const arr = themes.map(t => {
            t.categories = t.categories.map(c => {
                if (c.id === category.id) {
                    c[key] = value;
                }
                return c;
            })
            return t;
        });

        setThemes(arr);
    }

    const isThemeExpanded = (theme) => {
        return expandedThemes.indexOf(`theme-${theme.id}`) >= 0;
    }

    const renderThemes = () => {
        return themes.map(theme => {
            return (
                <Theme
                    theme={theme}
                    isThemeExpanded={isThemeExpanded(theme)}
                    categoryToggled={props.categoryToggled}
                />
            )
        })
    }

    const handleTreeViewToggle = (event, nodeIds) => {
        if (event.target.localName === 'input') {
            // switch toggled
            return;
        }
        setExpandedThemes(nodeIds);
    }

    const renderTreeview = () => {
        return (
            <TreeView
                disableSelection={true}
                expanded={expandedThemes}
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