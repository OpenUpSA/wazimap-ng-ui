import React from "react";
import {StyledTreeItem} from "./styled_elements";
import ThemeLabel from "./theme_label";
import Category from "./category";
import {createTheme, ThemeProvider} from "@mui/material";
import {calculateThemeBackgroundColor} from "../../utils";

const Theme = (props) => {
    const renderCategories = (categories) => {
        return categories.map(category => {
            styleTheme.palette.child = category.isSelected ? calculateThemeBackgroundColor(props.theme.color) : '#f0f0f0';
            console.log({
                category,
                'isSelected': JSON.stringify(category.isSelected),
                styleTheme,
                'child': styleTheme.palette.child
            })
            return (
                <Category
                    category={category}
                    categoryToggled={props.categoryToggled}
                    styleTheme={styleTheme}
                />
            )
        })
    }

    const checkIfAllCategoriesAreSelected = () => {
        return !props.theme.categories.some(x => !x.isSelected);
    }

    let styleTheme = createTheme({
        palette: {
            parent: checkIfAllCategoriesAreSelected() ? calculateThemeBackgroundColor(props.theme.color) : '#f0f0f0',
            child: '#f0f0f0'
        },
    });

    return (
        <ThemeProvider theme={styleTheme}>
            <StyledTreeItem
                nodeId={`theme-${props.theme.id}`}
                key={props.theme.id}
                label={
                    <ThemeLabel
                        theme={props.theme}
                        isThemeExpanded={props.isThemeExpanded}
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
            </StyledTreeItem>
        </ThemeProvider>
    )
}

export default Theme;