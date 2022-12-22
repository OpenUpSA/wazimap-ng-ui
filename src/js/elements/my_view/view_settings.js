import React, {useEffect, useState} from "react";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {IndicatorOptionsSvg, TrashBinSvg} from "./svg_icons";
import {
    Container,
    FilteredIndicatorBox,
    FilteredIndicatorCard, HelpText,
    IconContainer,
    RemoveButton,
    StyledAccordion,
    StyledAccordionDetails,
    StyledAccordionSummary,
    StyledTypography, StyledTypographyWithBottomBorder,
    ViewSettingsTitle
} from "./styled_elements"
import {Grid} from "@mui/material";

const ViewSettings = (props) => {
    const [expanded, setExpanded] = useState('');
    const [filteredIndicators, setFilteredIndicators] = useState([]);
    const indicatorOptionsSvg = IndicatorOptionsSvg;
    const trashBinSvg = TrashBinSvg;

    useEffect(() => {
        if (props.filteredIndicators !== filteredIndicators) {
            setFilteredIndicators(props.filteredIndicators);
        }
    }, [props.filteredIndicators]);

    const handleExpandedChange = (panel) => {
        setExpanded(panel);
    };

    const renderFilteredIndicators = () => {
        return (
            props.filteredIndicators.map((fi) => {
                return fi.filters.map((sf, index) => {
                    if (!sf.isDefault) {
                        return (
                            <Grid item xs={12} key={fi.indicatorId + '_' + index}>
                                <FilteredIndicatorCard>
                                    <Grid container>
                                        <Grid item xs={10}>
                                            <Grid item xs={12}>
                                                <FilteredIndicatorBox>
                                                    {fi.indicatorTitle}
                                                </FilteredIndicatorBox>
                                            </Grid>
                                            <Grid container sx={{marginTop: '8px'}}>
                                                <Grid item xs={6} sx={{paddingRight: '3px'}}>
                                                    <FilteredIndicatorBox>
                                                        {sf.group}
                                                    </FilteredIndicatorBox>
                                                </Grid>
                                                <Grid item xs={6} sx={{paddingLeft: '3px'}}>
                                                    <FilteredIndicatorBox>
                                                        {sf.value}
                                                    </FilteredIndicatorBox>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={2}>
                                            <RemoveButton onClick={() => props.removeFilter(fi, sf)}>
                                                {trashBinSvg}
                                            </RemoveButton>
                                        </Grid>
                                    </Grid>
                                </FilteredIndicatorCard>
                            </Grid>
                        )
                    }
                })
            })
        )
    }

    return (
        <Container>
            <ViewSettingsTitle>
                View settings
            </ViewSettingsTitle>
            <StyledAccordion
                expanded={expanded === 'indicatorOptions'}
                onChange={() => handleExpandedChange(expanded === 'indicatorOptions' ? '' : 'indicatorOptions')}
            >
                <StyledAccordionSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls={'indicatorOptions-content'}
                    id={'indicatorOptions-header'}
                >
                    <IconContainer>
                        {indicatorOptionsSvg}
                    </IconContainer>
                    <StyledTypography>INDICATOR OPTIONS</StyledTypography>
                </StyledAccordionSummary>
                <StyledAccordionDetails>
                    <StyledTypographyWithBottomBorder>
                        INDICATOR SPECIFIC OPTIONS
                    </StyledTypographyWithBottomBorder>
                    {renderFilteredIndicators()}
                    <HelpText>
                        Any indicators you adjust will appear here
                    </HelpText>
                </StyledAccordionDetails>
            </StyledAccordion>
        </Container>
    );
}

export default ViewSettings;