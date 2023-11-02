import React from 'react';
import {styled} from '@mui/system';
import SvgIcon from '@mui/material/SvgIcon';
import Box from '@mui/material/Box';

import TreeItem, {treeItemClasses} from '@mui/lab/TreeItem';


export const StyledCategoryTreeItem = styled(TreeItem)(() => ({
    [`& .${treeItemClasses.content}`]: {
        'flexDirection': 'row-reverse',
        'marginBottom': '8px',
        'backgroundColor': '#39ad84',
        'borderRadius': '2px',
        'height': '36px',
        'paddingLeft': '8px',
        'transition': 'all .2s ease',
        'color': '#fff',
        'textDecoration': 'none',
        'cursor': 'pointer',
        'fontFamily': 'Roboto,sans-serif',
        '&:hover': {
            'backgroundColor': '#39ad84',
        },
        '&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused': {
            'backgroundColor': '#39ad84',
        },
        '& .MuiTreeItem-iconContainer svg': {
            fontSize: '22px'
        },
        '& .MuiTreeItem-label': {
            paddingLeft: '0px',
        },
        '& .MuiBox-root': {
            padding: '0px',
        },
        [`& .${treeItemClasses.label}`]: {
            'width': '100%',
            'whiteSpace': 'nowrap',
            'overflow': 'hidden',
            'textOverflow': 'ellipsis',
            'fontSize': '1em',
            'fontWeight': '500',
            'letterSpacing': '.3px',
            'marginRight': '12px',
            'paddingLeft': '0px',
        },
    },
    [`& .${treeItemClasses.group}`]: {
        marginLeft: '12px',
    }
}));

export const StyledSubCategoryTreeItem = styled(TreeItem)(() => ({
    [`& .${treeItemClasses.content}`]: {
        'flexDirection': 'row-reverse',
        'backgroundColor': '#f0f0f0',
        'borderRadius': '2px',
        'marginBottom': '6px',
        'height': '32px',
        'paddingLeft': '8px',
        'transition': 'all .2s ease',
        'textDecoration': 'none',
        'cursor': 'pointer',
        'fontFamily': 'Roboto,sans-serif',
        '&:hover': {
            'backgroundColor': '#f0f0f0',
        },
        '&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused': {
            'backgroundColor': '#f0f0f0',
        },
        '& .MuiTreeItem-iconContainer svg': {
            fontSize: '18px',
            color: '#666'
        },
        '& .MuiTreeItem-label': {
            paddingLeft: '0px',
        },
        '& .MuiBox-root': {
            padding: '0px',
        },
        [`& .${treeItemClasses.label}`]: {
            'width': '100%',
            'whiteSpace': 'nowrap',
            'overflow': 'hidden',
            'textOverflow': 'ellipsis',
            'fontSize': '.85em',
            'fontWeight': '500',
            'letterSpacing': '.3px',
            'marginRight': '12px',
            'paddingLeft': '0px',
            'color': '#666'
        },
    },
    [`& .${treeItemClasses.group}`]: {
        marginLeft: '12px',
    }
}));

export const StyledSubindicatorTreeItem = styled(TreeItem)(() => ({
    [`& .${treeItemClasses.content}`]: {
        'flexDirection': 'row-reverse',
        'backgroundColor': '#f0f0f0',
        'borderRadius': '2px',
        'marginBottom': '6px',
        'height': '32px',
        'paddingLeft': '8px',
        'transition': 'all .2s ease',
        'textDecoration': 'none',
        'cursor': 'pointer',
        'fontFamily': 'Roboto,sans-serif',
        '&:hover': {
            'backgroundColor': '#dad7d7',
        },
        '&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused': {
            'backgroundColor': '#dad7d7',
        },
        '& .MuiTreeItem-iconContainer svg': {
            fontSize: '18px',
            color: '#666'
        },
        '& .MuiTreeItem-label': {
            paddingLeft: '0px',
        },
        '& .MuiBox-root': {
            padding: '0px',
        },
        '&::after': {
            position: 'absolute',
            'left': '24px',
            'zIndex': '1',
            'width': '8px',
            'height': '1px',
            marginLeft: '4px',
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            content: '""'
        },
        [`& .${treeItemClasses.label}`]: {
            'width': '100%',
            'whiteSpace': 'nowrap',
            'overflow': 'hidden',
            'textOverflow': 'ellipsis',
            'fontSize': '.85em',
            'fontWeight': '500',
            'letterSpacing': '.3px',
            'marginRight': '12px',
            'paddingLeft': '0px',
            'color': '#666'
        },
    },
    [`& .${treeItemClasses.group}`]: {
        marginLeft: '12px'
    }
}));

export const StyledNoSubindicatorTreeItem = styled(StyledSubindicatorTreeItem)(() => ({
    [`& .${treeItemClasses.content}`]: {
        'height': '56px',
        'cursor': 'unset',
        '&:hover': {
            'backgroundColor': '#f0f0f0',
        },
        '&::after': {
            backgroundColor: 'unset',
        },
        [`& .${treeItemClasses.label}`]: {
            'whiteSpace': 'normal',
        }
    }
}));

export const StyledIndicatorTreeItem = styled(TreeItem)(() => ({
    [`& .${treeItemClasses.content}`]: {
        'flexDirection': 'row-reverse',
        'backgroundColor': '#f0f0f0',
        'borderRadius': '2px',
        'marginBottom': '6px',
        'height': '32px',
        'paddingLeft': '8px',
        'transition': 'all .2s ease',
        'textDecoration': 'none',
        'cursor': 'pointer',
        'fontFamily': 'Roboto,sans-serif',
        '&:hover': {
            'backgroundColor': '#f0f0f0',
        },
        '&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused': {
            'backgroundColor': '#f0f0f0',
        },
        '& .MuiTreeItem-iconContainer svg': {
            fontSize: '18px',
            color: '#666'
        },
        '& .MuiTreeItem-label': {
            paddingLeft: '0px',
        },
        '& .MuiBox-root': {
            padding: '0px',
        },
        [`& .${treeItemClasses.label}`]: {
            'width': '100%',
            'whiteSpace': 'nowrap',
            'overflow': 'hidden',
            'textOverflow': 'ellipsis',
            'fontSize': '.85em',
            'fontWeight': '500',
            'letterSpacing': '.3px',
            'marginRight': '12px',
            'paddingLeft': '0px',
            'color': '#666'
        },
    },
    [`& .${treeItemClasses.group}`]: {
        marginLeft: '12px',
        borderLeft: '1px solid rgba(0, 0, 0, 0.11)',
        marginLeft: '0px',
        paddingLeft: '11px',
        marginLeft: '3px',
    }
}));


export const ParentContainer = styled(Box)(({theme}) => ({
    display: 'grid',
    gridAutoColumns: '1fr',
    borderRadius: 2,
    backgroundColor: '#f0f0f0',
    padding: '6px',
    marginTop: '20px',
    paddingLeft: '0px',
}));

export const IconContainer = styled(Box)(({theme}) => ({
    gridRow: '1',
    gridColumn: '1/2'
}));

export const TextContainer = styled(Box)(({theme}) => ({
    gridRow: '1',
    gridColumn: 'span 5',
    '& p': {
        color: '#666',
        fontSize: '0.9em',
        fontWeight: '500',
        lineHeight: '20px',
        marginBottom: '0'
    }
}));

export const Link = styled('a')(({theme}) => ({
    color: '#39ad84'
}));

const PanelIcon = (props) => {
    return (
        <SvgIcon {...props}>
            <path
                fill="currentColor"
                d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"
            ></path>
        </SvgIcon>
    );
}

export const PanelIconSidebar = styled(PanelIcon)(({theme}) => ({
    fontSize: '30px',
    margin: 'auto',
    display: 'block',
    marginTop: '5px',
}));

export const PanelIconLink = styled(PanelIcon)(({theme}) => ({
    fontSize: '18px',
    verticalAlign: 'bottom',
    color: '#39ad84'
}));
