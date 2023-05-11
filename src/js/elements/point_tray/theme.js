import React from "react";
import {StyledTreeItem} from "./styled_elements";
import ThemeLabel from "./theme_label";
import Category from "./category";
import {createTheme, ThemeProvider} from "@mui/material";
import {calculateThemeBackgroundColor} from "../../utils";

const Theme = (props) => {
    const renderCategories = (categories) => {
        return categories.map(category => {
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

    const checkIfThemeIsLoading = () => {
        return props.theme.categories.some(x => x.isLoading);
    }

    let styleTheme = createTheme({
        palette: {
            main: '#f0f0f0',
            selected: calculateThemeBackgroundColor(props.theme.color)
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
                        isThemeSelected={checkIfAllCategoriesAreSelected()}
                        isThemeLoading={checkIfThemeIsLoading()}
                        themeToggled={props.themeToggled}
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
                className={checkIfAllCategoriesAreSelected() ? 'selected' : ''}
            >
                {renderCategories(props.theme.categories)}
            </StyledTreeItem>
        </ThemeProvider>
    )
}

export default Theme;