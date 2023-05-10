import {styled} from "@mui/system";
import TreeItem, {treeItemClasses} from "@mui/lab/TreeItem";
import {Switch} from "@mui/material";

export const CategoryTreeItem = styled(TreeItem)(() => ({
    [`& .${treeItemClasses.content}`]: {
        backgroundColor: '#f0f0f0',
        borderRadius: '2px',
        padding: '0px',
        marginBottom: '4px',
        color: '#666',
        transitionDuration: '0.2s',
        '&:hover': {
            backgroundColor: '#d8d8d8',
            color: '#000'
        },
        [`& .${treeItemClasses.label}`]: {
            fontWeight: '400',
            fontSize: '0.85em',
            padding: '10px',
            '& i': {
                fontSize: '14px'
            }
        },
        [`& .${treeItemClasses.iconContainer}`]: {
            display: 'none'
        }
    }
}));

export const ThemeTreeItem = styled(TreeItem)(() => ({
    [`& .${treeItemClasses.content}`]: {
        backgroundColor: '#f0f0f0',
        borderRadius: '2px',
        padding: '0px',
        paddingLeft: '12px',
        marginBottom: '8px',
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
    [`& .${treeItemClasses.selected}`]: {}
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
                backgroundColor: theme.palette.mode === 'dark' ? '#177ddc' : '#1890ff',
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