import React, {useEffect, useState} from "react";
import {IndicatorOptionsSvg, TrashBinSvg, LockButtonInTextSvg} from "./svg_icons";

import {
    AppliedPanelInfo,
    Container,
    FilteredIndicatorBox,
    FilteredIndicatorCard, HelpText,
    IconContainer,
    RemoveButton,
    StyledAccordion,
    StyledAccordionDetails,
    StyledAccordionSummary,
    StyledTypography, StyledTypographyWithBottomBorder,
    ViewSettingsTitle,
    IndicatorTreeViewCard,
    StyledBoxWithBottomBorder,
    StyledIconTypography,
    StyledTooltip, UnavailableFilteredIndicatorBox,
    FilterNotAvailableHelpText, UnavailableFilterIconContainer
} from "./styled_elements";
import {Grid} from "@mui/material";
import TreeView from '@mui/lab/TreeView';
import IndicatorCategoryTreeView from "./indicator_tree_view";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import InfoIcon from '@mui/icons-material/Info';


const ViewSettings = (props) => {
    const [expanded, setExpanded] = useState('');
    const [filteredIndicators, setFilteredIndicators] = useState([]);
    const [allFiltersAreAvailable, setAllFiltersAreAvailable] = useState(props.allFiltersAreAvailable);
    const [profileIndicators, setProfileIndicators] = useState([]);
    const [siteWideFiltersEnabled] = useState(props.siteWideFiltersEnabled);
    const indicatorOptionsSvg = IndicatorOptionsSvg;
    const trashBinSvg = TrashBinSvg;
    const lockButtonSvg = LockButtonInTextSvg;
    const hiddenIndicatorsTooltipText = () => {
        return (
            <>
                <p>
                    You can hide indicators to share a simplified view
                    with only the indicators relevant to your needs.
                </p>

                <p>
                    All indicators available in all geographic areas
                    are shown here, potentially including some which
                    may not be available at your currently-selected
                    geography.
                </p>
            </>
        )
    }

    useEffect(() => {
            if (props.filteredIndicators !== filteredIndicators) {
                setFilteredIndicators(props.filteredIndicators);
            }
            if (props.profileIndicators.length > 0 && profileIndicators.length === 0) {
                let profileIndicators = props.profileIndicators.map(
                    (category) => {
                        let subcategories = []
                        category.subcategories.map(
                            subcategory => {
                                if (subcategory.indicators.length > 0) {
                                    subcategories.push(subcategory)
                                }
                            }
                        )
                        return {
                            ...category,
                            subcategories: subcategories
                        }
                    }
                )
                profileIndicators = profileIndicators.filter(ind => ind.subcategories.length > 0);
                setProfileIndicators(profileIndicators);
            }
        }, [
            props.filteredIndicators,
            props.profileIndicators,
            setProfileIndicators,
            profileIndicators
        ]
    );

    useEffect(() => {
        if (allFiltersAreAvailable !== props.allFiltersAreAvailable) {
            setAllFiltersAreAvailable(props.allFiltersAreAvailable);
        }
    }, [
        props.allFiltersAreAvailable
    ])

    const handleExpandedChange = (panel) => {
        setExpanded(panel);
    };

    const showPanelName = (appliesTo) => {
        if (appliesTo === 'data_explorer') {
            return 'Data mapper';
        } else if (appliesTo === 'rich_data') {
            return 'Rich data view';
        }
    }

    const renderFilteredIndicators = () => {
        return (
            props.filteredIndicators.map((fi) => {
                return fi.filters.map((sf, index) => {
                    if (!sf.isDefault) {
                        return (
                            <Grid item xs={12} key={fi.indicatorId + '_' + index}>
                                <FilteredIndicatorCard
                                    data-test-id={'filtered-indicator-card'}
                                >
                                    <Grid container>
                                        <Grid item xs={11} sx={{paddingRight: '6px'}}>
                                            <Grid item xs={12} sx={{position: 'relative'}}>
                                                {renderIndicatorTitleBox(fi, sf)}
                                            </Grid>
                                            <Grid container sx={{marginTop: '8px'}}>
                                                <Grid item xs={6} sx={{paddingRight: '3px', position: 'relative'}}>
                                                    {renderFilterValueBox(sf.group, sf.isFilterAvailable, '-1px')}
                                                </Grid>
                                                <Grid item xs={6} sx={{paddingLeft: '3px', position: 'relative'}}>
                                                    {renderFilterValueBox(sf.value, sf.isFilterAvailable, '-4px')}
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={1}>
                                            <RemoveButton
                                                onClick={() => props.removeFilter(fi, sf)}
                                                data-test-id={'filtered-indicator-remove-button'}
                                            >
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

    const renderIndicatorTitleBox = (fi, sf) => {
        if (fi.indicatorIsAvailable) {
            return (
                <FilteredIndicatorBox
                    title={`${fi.indicatorTitle} (${sf.appliesTo})`}
                >
                    <AppliedPanelInfo>
                        {showPanelName(sf.appliesTo[0])}
                    </AppliedPanelInfo>
                    {fi.indicatorTitle}
                </FilteredIndicatorBox>
            )
        } else {
            // not available
            return (
                <UnavailableFilteredIndicatorBox
                    title={`${fi.indicatorTitle} (${sf.appliesTo})`}
                    sx={{
                        '&::after': {
                            right: '-4px',
                        }
                    }}
                >
                    <AppliedPanelInfo>
                        {showPanelName(sf.appliesTo[0])}
                    </AppliedPanelInfo>
                    <i>Indicator no longer available*</i>
                </UnavailableFilteredIndicatorBox>
            )
        }
    }

    const renderFilterValueBox = (value, isAvailable, rightVal) => {
        if (isAvailable) {
            return (
                <FilteredIndicatorBox>
                    {value}
                </FilteredIndicatorBox>
            )
        } else {
            return (
                <UnavailableFilteredIndicatorBox
                    sx={{
                        '&::after': {
                            right: rightVal,
                        }
                    }}
                >
                    <s>{value}</s>
                </UnavailableFilteredIndicatorBox>
            )
        }
    }

    const renderIndicatorTreeView = () => {
        return (
            <Grid item xs={12}>
                <IndicatorTreeViewCard>
                    <TreeView
                        defaultCollapseIcon={<ArrowDropDownIcon/>}
                        defaultExpandIcon={<ArrowRightIcon/>}
                    >
                        {profileIndicators.length > 0 && profileIndicators.map(
                            (item, key) => {
                                return (
                                    <IndicatorCategoryTreeView
                                        category={item}
                                        key={key}
                                        updateHiddenIndicators={props.updateHiddenIndicators}
                                        hiddenIndicators={props.hiddenIndicators}
                                    />
                                )
                            })
                        }
                    </TreeView>
                </IndicatorTreeViewCard>
            </Grid>
        );
    }

    const renderSiteWideFilters = () => {
        return (
            props.siteWideFilters.map((swf, index) => {
                return (
                    <Grid item xs={12} key={index}>
                        <FilteredIndicatorCard
                            data-test-id={'site-wide-filter-card'}
                        >
                            <Grid container>
                                <Grid item xs={10}>
                                    <Grid container>
                                        <Grid item xs={6} sx={{paddingRight: '3px'}}>
                                            <FilteredIndicatorBox
                                                data-test-id={'site-wide-filter-indicator'}
                                            >
                                                {swf.indicatorValue}
                                            </FilteredIndicatorBox>
                                        </Grid>
                                        <Grid item xs={6} sx={{paddingLeft: '3px'}}>
                                            <FilteredIndicatorBox
                                                data-test-id={'site-wide-filter-subIndicator'}
                                            >
                                                {swf.subIndicatorValue}
                                            </FilteredIndicatorBox>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={2}>
                                    <RemoveButton
                                        onClick={() => props.removeSiteWideFilter(swf)}
                                    >
                                        {trashBinSvg}
                                    </RemoveButton>
                                </Grid>
                            </Grid>
                        </FilteredIndicatorCard>
                    </Grid>
                )
            })
        )
    }

    const renderSiteWideFilterSection = () => {
        if (!siteWideFiltersEnabled) {
            return <div></div>
        } else {
            return (
                <div>
                    <StyledTypographyWithBottomBorder>
                        SITE-WIDE INDICATOR FILTERS
                    </StyledTypographyWithBottomBorder>
                    {renderSiteWideFilters()}
                    <HelpText>
                        Toggle a site-wide filter by clicking the {lockButtonSvg} next to any indicator.
                    </HelpText>
                </div>
            )
        }
    }

    const renderFiltersNotAvailableHelpText = () => {
        if (allFiltersAreAvailable) {
            return <HelpText></HelpText>
        } else {
            return (
                <FilterNotAvailableHelpText>
                    {props.filtersNotAvailableText}
                </FilterNotAvailableHelpText>
            )
        }
    }

    const renderIndicatorOptionsIcon = () => {
        if (allFiltersAreAvailable) {
            return (
                <IconContainer>
                    {indicatorOptionsSvg}
                </IconContainer>
            )
        } else {
            return (
                <UnavailableFilterIconContainer>
                    {indicatorOptionsSvg}
                </UnavailableFilterIconContainer>
            )
        }
    }

    return (
        <Container>
            <ViewSettingsTitle>
                View settings
            </ViewSettingsTitle>
            <StyledAccordion
                disableGutters
                expanded={expanded === 'indicatorOptions'}
                onChange={() => handleExpandedChange(expanded === 'indicatorOptions' ? '' : 'indicatorOptions')}
            >
                <StyledAccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{width: '32px', height: '32px'}}/>}
                    aria-controls={'indicatorOptions-content'}
                    id={'indicatorOptions-header'}
                >
                    {renderIndicatorOptionsIcon()}
                    <StyledTypography>INDICATOR OPTIONS</StyledTypography>
                </StyledAccordionSummary>
                <StyledAccordionDetails>
                    {renderSiteWideFilterSection()}
                    <StyledTypographyWithBottomBorder>
                        INDICATOR-SPECIFIC OPTIONS
                    </StyledTypographyWithBottomBorder>
                    <HelpText>
                        Any indicators you adjust will appear here
                    </HelpText>
                    {renderFilteredIndicators()}
                    {renderFiltersNotAvailableHelpText()}

                    <StyledBoxWithBottomBorder>
                        <StyledTypography variant="body2" sx={{width: "100%"}}>
                            HIDDEN INDICATORS
                        </StyledTypography>
                        <StyledIconTypography
                        >
                            <StyledTooltip title={hiddenIndicatorsTooltipText()} arrow placement="top">
                                <InfoIcon fontSize="small"/>
                            </StyledTooltip>
                        </StyledIconTypography>
                    </StyledBoxWithBottomBorder>
                    {renderIndicatorTreeView()}
                    <HelpText>
                        Hidden indicators are not shown in the Data Mapper panel to help focus your view.
                    </HelpText>
                </StyledAccordionDetails>
            </StyledAccordion>
        </Container>
    );
}

export default ViewSettings;
