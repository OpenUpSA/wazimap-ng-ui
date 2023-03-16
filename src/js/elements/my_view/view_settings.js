import React, {useEffect, useState} from "react";

import {IndicatorOptionsSvg, TrashBinSvg} from "./svg_icons";
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
    StyledTreeItem,
    IndicatorTreeViewCard
} from "./styled_elements";
import {Grid} from "@mui/material";
import TreeView from '@mui/lab/TreeView';
import TreeItem from '@mui/lab/TreeItem';
import Box from "@mui/material/Box";
import IndicatorCategoryTreeView from "./indicator_tree_view";
import {flatten, map} from "lodash";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';


const ViewSettings = (props) => {
    const [expanded, setExpanded] = useState('');
    const [filteredIndicators, setFilteredIndicators] = useState([]);
    const [profileIndicators, setProfileIndicators] = useState([]);
    const indicatorOptionsSvg = IndicatorOptionsSvg;
    const trashBinSvg = TrashBinSvg;

    useEffect(() => {
        if (props.filteredIndicators !== filteredIndicators) {
            setFilteredIndicators(props.filteredIndicators);
        }
        if (props.profileIndicators.length > 0 && profileIndicators.length === 0){
          let profileIndicators = props.profileIndicators.map(
            (category) => {
              let subcategories = []
              category.subcategories.map(
                subcategory => {
                  if (subcategory.indicators.length > 0){
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
                                            <Grid item xs={12}>
                                                <FilteredIndicatorBox
                                                    title={`${fi.indicatorTitle} (${sf.appliesTo})`}
                                                >
                                                    <AppliedPanelInfo>
                                                        {showPanelName(sf.appliesTo[0])}
                                                    </AppliedPanelInfo>
                                                    {`${fi.indicatorTitle}`}
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

    const renderIndicatorTreeView = () =>{
      return (
        <Grid item xs={12}>
          <IndicatorTreeViewCard>
            <TreeView
              defaultCollapseIcon={<ArrowDropDownIcon />}
              defaultExpandIcon={<ArrowRightIcon />}
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
                    <IconContainer>
                        {indicatorOptionsSvg}
                    </IconContainer>
                    <StyledTypography>INDICATOR OPTIONS</StyledTypography>
                </StyledAccordionSummary>
                <StyledAccordionDetails>
                    <StyledTypographyWithBottomBorder>
                        INDICATOR-SPECIFIC OPTIONS
                    </StyledTypographyWithBottomBorder>
                    {renderFilteredIndicators()}
                    <HelpText>
                        Any indicators you adjust will appear here
                    </HelpText>
                </StyledAccordionDetails>

                <StyledAccordionDetails>
                    <StyledTypographyWithBottomBorder>
                        HIDDEN INDICATORS
                    </StyledTypographyWithBottomBorder>
                    {renderIndicatorTreeView()}
                    <HelpText>
                        Hidden indicators are not shownin the Data Mapper panel to help focus your view.
                    </HelpText>
                </StyledAccordionDetails>
            </StyledAccordion>
        </Container>
    );
}

export default ViewSettings;
