import {styled} from "@mui/system";
import TreeItem, {treeItemClasses} from "@mui/lab/TreeItem";

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
            padding: '10px'
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
            padding: '11px',
            lineHeight: '1.2'
        }
    }
}));