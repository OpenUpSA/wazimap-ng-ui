import {styled} from "@mui/system";
import Box from "@mui/material/Box";
import {Accordion, AccordionDetails, AccordionSummary, Button, Card, Typography} from "@mui/material";

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

export const StyledTypographyWithBottomBorder = styled(StyledTypography)(() => ({
    borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
    paddingBottom: '15px',
    marginBottom: '20px'
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