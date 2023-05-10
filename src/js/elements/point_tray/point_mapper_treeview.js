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
            setCategoryLoading(category, true);
        });

        props.parent.on('point_data.category.loaded', category => {
            setCategoryLoading(category, false);
        });
    }

    const setCategoryLoading = (category, isLoading) => {
        const arr = themes.map(t => {
            t.categories = t.categories.map(c => {
                if (c.id === category.id) {
                    c.isLoading = isLoading;
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