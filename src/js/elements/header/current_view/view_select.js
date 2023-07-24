import React, {useState} from "react";
import {FormControl, MenuItem, Select, selectClasses} from "@mui/material";
import {styled} from "@mui/system";

const ViewSelect = (props) => {
    const [views] = useState(props.viewsArr);
    const [selectedView] = useState(props.viewData.viewName);


    const StyledSelect = styled(Select)(() => ({
        [`& .${selectClasses.filled}`]: {
            paddingTop: '12px',
            fontSize: '0.9em',
            lineHeight: '1.2',
            color: '#666'
        },
        [`& .${selectClasses.icon}`]: {
            top: 'unset'
        },
        ['& a']: {
            color: 'rgb(51, 51, 51)',
            textDecoration: 'none'
        }
    }));

    const StyledMenuItem = styled(MenuItem)(() => ({
        padding: '0px',
        fontSize: '0.9em',
        lineHeight: '1.2',
        ['& a']: {
            display: 'block',
            width: '100%',
            paddingLeft: '16px',
            paddingRight: '16px',
            paddingTop: '12px',
            paddingBottom: '12px',
            color: '#666',
            textDecoration: 'none'
        },
        ['& p']: {
            width: '100%',
            paddingLeft: '16px',
            paddingRight: '16px',
            paddingTop: '7.71px',
            paddingBottom: '0px',
            color: '#666',
        }
    }));

    const handleChange = (event) => {
        return;
    };

    const getLabel = (view) => {
        let label = views[view].label;
        if (label == null) {
            label = view;
        }

        return label;
    }

    const getViewUrl = (view) => {
        let url = views[view].url;
        if (url == null) {
            url = `${window.location.origin}?view=${view}`;
        }

        return url;
    }

    const renderMenuItemContent = (view) => {
        if (view === selectedView) {
            return <p>{getLabel(view)}</p>
        } else {
            return (
                <a href={getViewUrl(view)} target={'_blank'}>{getLabel(view)}</a>
            )
        }
    }

    return (
        <FormControl fullWidth>
            <StyledSelect
                value={selectedView}
                onChange={handleChange}
                size={'small'}
                variant={'filled'}
                disableUnderline
                IconComponent={(props) => (
                    <svg
                        {...props}
                        xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <path d="M0 0h24v24H0z" fill="none"></path>
                        <path fill="currentColor" d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"></path>
                    </svg>
                )}
            >
                {
                    Object.keys(views).map((view, index) => (
                        <StyledMenuItem
                            value={view}
                            key={index}
                        >
                            {renderMenuItemContent(view)}
                        </StyledMenuItem>
                    ))
                }
            </StyledSelect>
        </FormControl>
    );
}

export default ViewSelect;