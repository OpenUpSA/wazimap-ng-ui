import React, {useState} from "react";
import {FormControl, MenuItem, Select, selectClasses} from "@mui/material";
import {styled} from "@mui/system";

const ViewSelect = (props) => {
    const [viewArr] = useState(props.viewsArr);
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
        let label = view.label;
        if (label == null) {
            label = view.name;
        }

        return label;
    }

    const getLabelFromViewName =(viewName)=>{
        let view = viewArr.filter(x => x.name === viewName)[0];
        return getLabel(view);
    }

    const getViewUrl = (view) => {
        let url = view.url;
        if (url == null) {
            url = `${window.location.origin}?view=${view.name}`;
        }

        return url;
    }

    const renderMenuItemContent = (view) => {
        if (view.name === selectedView) {
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
                value={getLabelFromViewName(selectedView)}
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
                    viewArr.map((view, index) => (
                        <StyledMenuItem
                            value={getLabel(view)}
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