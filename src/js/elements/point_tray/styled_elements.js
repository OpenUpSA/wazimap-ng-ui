import {styled} from "@mui/system";
import TreeItem, {treeItemClasses} from "@mui/lab/TreeItem";
import {Switch, Grid} from "@mui/material";

export const StyledTreeItem = styled(TreeItem)(({theme}) => ({
    marginBottom: '8px',
    [`&.selected .${treeItemClasses.content}`]: {
        backgroundColor: theme.palette.selected,
        '&:hover': {
            backgroundColor: theme.palette.selected,
            color: '#333'
        },
    },
    [`& .${treeItemClasses.content}`]: {
        backgroundColor: theme.palette.main,
        borderRadius: '2px',
        padding: '0px',
        paddingLeft: '12px',
        color: '#333',
        transitionDuration: '0.2s',
        '&:hover': {
            backgroundColor: '#d8d8d8',
            color: '#000'
        },
        [`& .${treeItemClasses.label}`]: {
            fontWeight: '500',
            fontSize: '0.9em',
            padding: '8px',
            lineHeight: '1.2'
        }
    },
    [`& .${treeItemClasses.group}`]: {
        marginTop: '8px',
        borderLeft: '1px solid rgba(0, 0, 0, 0.11)',
        paddingLeft: '8px',

        [`& .${treeItemClasses.root}`]: {
            marginBottom: '4px',
            '&:last-child': {
                marginBottom: '0px',
            },
            '&:after': {
                position: 'absolute',
                left: '24px',
                width: '8px',
                height: '1px',
                marginTop: '-19px',
                marginLeft: '12px',
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                content: '""'
            },
        },
        [`& .${treeItemClasses.content}`]: {
            backgroundColor: theme.palette.main,
            borderRadius: '2px',
            padding: '0px',
            color: '#666',
            height: '38px',
            transitionDuration: '0.2s',
            '&:hover': {
                backgroundColor: '#d8d8d8',
                color: '#000'
            },
            [`& .${treeItemClasses.label}`]: {
                fontWeight: '400',
                fontSize: '0.85em',
                lineHeight: '1.2em',
                padding: '10px',
                '& i': {
                    fontSize: '14px'
                }
            },
            [`& .${treeItemClasses.iconContainer}`]: {
                display: 'none'
            }
        },
        [`& .selected .${treeItemClasses.content}`]: {
            backgroundColor: theme.palette.selected,
        },
    }
}));

export const TextTruncatingGrid = styled(Grid)(({theme}) => ({
    overflow: 'hidden',
    whiteSpace: 'noWrap',
    textOverflow: 'ellipsis',
    paddingRight: '5px'
}));

export const AntSwitch = styled(Switch)(({theme}) => ({
    width: 32,
    height: 20,
    padding: 0,
    margin: '0 auto',
    display: 'flex',
    '&:active': {
        '& .MuiSwitch-thumb': {
            width: 15,
        },
        '& .MuiSwitch-switchBase.Mui-checked': {
            transform: 'translateX(9px)',
        },
    },
    '& .MuiSwitch-switchBase': {
        padding: 2,
        '&.Mui-checked': {
            transform: 'translateX(12px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
                opacity: 1,
                backgroundColor: theme.palette.mode === 'dark' ? '#3c3c3c' : '#3c3c3c',
            },
        },
    },
    '& .MuiSwitch-thumb': {
        boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
        width: 12,
        height: 12,
        borderRadius: 6,
        marginTop: 2,
        marginLeft: 2
    },
    '& .MuiSwitch-track': {
        borderRadius: 34,
        opacity: 1,
        backgroundColor: 'rgba(0,0,0,.18823529411764706)',
        boxSizing: 'border-box',
    },
}));