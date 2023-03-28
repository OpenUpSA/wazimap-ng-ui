import React from "react";
import {styled} from "@mui/system";
import Box from "@mui/material/Box";
import {Accordion, AccordionDetails, AccordionSummary, Button, Card, Typography} from "@mui/material";
import TreeItem, { treeItemClasses } from '@mui/lab/TreeItem';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';


export const StyledCategoryTreeItem = styled(TreeItem)(() => ({
  [`& .${treeItemClasses.content}`]: {
    flexDirection: 'row-reverse',
    borderRadius: '4px',
    marginBottom: '8px',
    backgroundColor: 'rgba(0, 0, 0, 0.05);',
    height: '32px',
    paddingLeft: '8px',
    textDecoration: 'none',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.07);',
    },
    '&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused': {
      backgroundColor: 'rgba(0, 0, 0, 0.05);',
    },
    '& .MuiTreeItem-iconContainer svg': {
      fontSize: '20px',
      color: '#707070'
    },
    [`& .${treeItemClasses.label}`]: {
      width: '100%',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      fontSize: '14px',
      letterSpacing: '.3px',
      marginRight: '12px',
      paddingLeft: '0px',
      color: '#2F2F2F',
      fontSize: '14px',
      alignItems: 'center',
      '& .MuiBox-root': {
        padding: '0px',
        display: 'flex',
        '& p': {
          flexGrow: 1,
          paddingRight: '10px',
        },
        '& span': {
          color: '#707070'
        }
      },
    },
  },
  [`& .${treeItemClasses.group}`]: {
    marginLeft: '12px',
  }
}));

export const StyledSubCategoryTreeItem = styled(StyledCategoryTreeItem)(() => ({
  [`& .${treeItemClasses.group}`]: {
    marginLeft: '12px',
    borderLeft: '1px solid rgba(0, 0, 0, 0.11)',
    marginLeft: '0px',
    paddingLeft: '11px',
    marginLeft: '6px',
  }
}));

export const StyledTreeItem = styled(TreeItem)(() => ({
  [`& .${treeItemClasses.content}`]: {
    backgroundColor: 'rgba(0, 0, 0, 0.05);',
    borderRadius: '4px',
    marginBottom: '8px',
    '& .MuiTreeItem-iconContainer': {
      display: 'none',
    },
    '&::after': {
      position: 'absolute',
        left: '8.5%',
        zIndex: '1',
        width: '10px',
        height: '1px',
        marginLeft: '4px',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        content: '""'
    },
    [`& .${treeItemClasses.label}`]: {
      fontWeight: 'inherit',
      color: 'inherit',
      marginRight: '0px',
      '& span': {
        display: 'flex',
        justifyContent: 'center',
      }
    },
  },
  [`& .${treeItemClasses.group}`]: {
    marginLeft: '12px'
  }
}));

export const StyledTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(() => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: "#2F2F2F",
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#2F2F2F",
    fontSize: "15px",
    maxWidth: 370,
    textAlign: "center",
  },
}));

export const Container = styled(Box)(() => ({}));

export const ViewSettingsTitle = styled(Box)(() => ({
    backgroundColor: '#333',
    color: '#fff',
    padding: '10px',
    paddingLeft: '20px',
    fontWeight: '700'
}));

export const StyledAccordionSummary = styled(AccordionSummary)(({theme}) => ({
    padding: '10px',
    paddingLeft: '20px',
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)'
}));

export const StyledTypography = styled(Typography)(() => ({
    color: '#707070',
    fontWeight: '600',
    letterSpacing: '0.06em',
    fontSize: '12px',
    lineHeight: 2
}));

export const StyledIconTypography = styled(Typography)(() => ({
    color: '#707070',
    '& svg': {
      fontSize: '17px',
      verticalAlign: 'bottom',
      '&:hover': {
        cursor: 'pointer'
      }
    }
}));

export const StyledTypographyWithBottomBorder = styled(StyledTypography)(() => ({
    borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
    paddingBottom: '15px',
    marginBottom: '20px'
}));

export const StyledBoxWithBottomBorder = styled(Box)(() => ({
    borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
    paddingBottom: '15px',
    marginBottom: '20px',
    display: 'flex'
}));

export const HelpText = styled(Typography)(() => ({
    fontSize: '12px',
    color: '#707070',
    fontWeight: '400',
    marginTop: '15px',
    marginBottom: '15px'
}));

export const IconContainer = styled(Box)(() => ({
    marginRight: '15px',
    display: 'inline-block'
}));

export const StyledAccordion = styled(Accordion)(() => ({
    boxShadow: 'unset'
}));

export const StyledAccordionDetails = styled(AccordionDetails)(() => ({
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    paddingTop: '25px',
    paddingBottom: '25px'
}));

export const AccordionDetailTitle = styled(Typography)(() => ({
    letterSpacing: '0.06em',
    color: '#707070'
}));

export const Header = styled(Box)(() => ({
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: '1.2em',
    display: 'block',
    alignItems: 'center',
    padding: '22px',
    borderBottom: '1px solid rgba(0, 0, 0, 0.1)'
}));

export const CloseButton = styled(Box)(() => ({
    float: 'right',
    cursor: 'pointer'
}));

export const MyViewTitle = styled(Box)(() => ({
    display: 'inline-block',
    lineHeight: '1.5em',
    verticalAlign: 'top'
}));

export const PanelContainer = styled(Box)(({}) => ({
    fontFamily: 'Roboto, sans-serif',
    position: 'fixed',
    width: '450px',
    backgroundColor: '#fff',
    right: '0',
    bottom: '0',
    top: '56px',
    zIndex: '999',
    boxShadow: '0 0 0 -1px rgb(0 0 0 / 20%), 1px 1px 6px -2px rgb(0 0 0 / 30%)',
    overflow: 'auto'
}));

export const ToggleContainer = styled(Box)(({}) => ({
    width: '44px',
    height: '44px',
    backgroundColor: '#fff',
    textAlign: 'center',
    cursor: 'pointer',
    alignContent: 'center',
    display: 'grid',
    boxShadow: '4px 0 8px 0 rgb(0 0 0 / 10%)',
    borderTopLeftRadius: '2px',
    borderBottomLeftRadius: '2px'
}));

export const ToggleIconContainer = styled(Box)(({}) => ({
    margin: 'auto',
    marginTop: '3px'
}));

export const FilteredIndicatorCard = styled(Card)(() => ({
    padding: '6px',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    borderRadius: '4px',
    marginTop: '10px'
}));

export const IndicatorTreeViewCard = styled(Card)(() => ({
    padding: '6px',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    borderRadius: '4px',
    marginTop: '10px'
}));

export const FilteredIndicatorBox = styled(Box)(() => ({
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    padding: '4px 6px 4px 12px',
    borderRadius: '4px',
    color: '#2F2F2F',
    fontWeight: '400',
    width: '100%',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: 'flex',
    alignItems: 'center'
}));

export const RemoveButton = styled(Button)(() => ({
    height: '100%',
    minWidth: 'unset',
    width: '100%'
}));

export const AppliedPanelInfo = styled(Box)(() => ({
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    padding: '4px',
    borderRadius: '3px',
    marginRight: '6px',
    fontSize: '12px'
}));

export const LoadingIconContainer = styled(Box)(() => ({
    display: 'flex',
    justifyContent: 'center',
    height: '100%',
    alignItems: 'center'
}));
