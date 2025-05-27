import React, {useState, useCallback, useMemo, useEffect} from "react";

import {
    StyledCategoryTreeItem,
    StyledSubCategoryTreeItem,
    StyledSubindicatorTreeItem,
    StyledIndicatorTreeItem,
    StyledNoSubindicatorTreeItem
} from "./styledElements";
import Box from "@mui/material/Box";
import {Typography} from "@mui/material";
import {checkIfSubIndicatorHasChildren} from "../../../utils";
import Tooltip from "@mui/material/Tooltip";


const LoadingItemView = (props) => {
    return (
        <StyledSubindicatorTreeItem nodeId={"loading"} label={
            <Box sx={{display: 'flex', alignItems: 'center', p: 0.5, pr: 0}}>
                <Typography variant="body2" sx={{fontSize: '1em', letterSpacing: '.3px', color: '#666'}}>
                    Loading...
                </Typography>
            </Box>
        }/>
    )
}

const getSubIndicators = (indicator) => {
    const primaryGroup = indicator.metadata.primary_group;
    const primaryGroupObj = indicator.metadata.groups.filter(
        group => group.name === primaryGroup
    )

    if (primaryGroupObj.length > 0) {
        return primaryGroupObj[0].subindicators.filter(
            sub => sub !== undefined && sub
        );
    }
    return [];
}

const NoSubindicatorView = (props) => {
    return (
        <StyledNoSubindicatorTreeItem
            nodeId={`datamapper-subindicator-${props.indicator.id}-not-available`}
            label={
                <Box sx={{display: 'flex', alignItems: 'center', p: 0.5, pr: 0}}>
                    <Typography noWrap={false} variant="body2"
                                sx={{fontSize: '1em', letterSpacing: '.3px', color: '#666'}}>
                        Data currently not available for this indicator.
                    </Typography>
                </Box>
            }
            data-test-id={`datamapper-subindicator-${props.indicator.id}-not-available`}
            className={"subIndicator-item"}
        />
    )
}

const SubindicatorItemView = (props) => {
    const onClickSubindicator = useCallback(
        () => {
            props.controller.onSubIndicatorClick({
                indicatorTitle: props.indicator.label,
                selectedSubindicator: props.subindicator,
                parents: props.parents,
                choropleth_method: props.indicator.choropleth_method,
                indicatorId: props.indicator.id,
                indicatorData: props.indicatorData,
                versionData: props.indicator.version_data,
                metadata: {
                    ...props.indicator.metadata,
                    indicatorDescription: props.indicator.description,
                },
                config: {
                    choroplethRange: props.indicator.choropleth_range,
                    enableLinearScrubber: props.indicator.enable_linear_scrubber,
                    chartConfiguration: props.indicator.chartConfiguration
                }
            })
        }, [
            props.controller,
            props.indicator,
            props.subindicator
        ]
    )

    return (
        <StyledSubindicatorTreeItem
            nodeId={`datamapper-subindicator-${props.indicator.id}-${props.subindicator}`}
            label={
                <Box sx={{display: 'flex', alignItems: 'center', p: 0.5, pr: 0}}>
                    <Typography variant="body2" sx={{fontSize: '1em', letterSpacing: '.3px', color: '#666'}}
                                className={"truncate"}>
                        {props.subindicator}
                    </Typography>
                </Box>
            }
            onClick={(e) => onClickSubindicator()}
            data-test-id={`datamapper-subindicator-${props.indicator.id}-${props.subindicator}`}
            className={"subIndicator-item"}
        />
    )
}

const IndicatorItemView = (props) => {
    const [loading, setLoading] = useState(false)

    const subindicators = useMemo(
        () => {
            const indicator = props.indicator;
            return getSubIndicators(indicator);
        }, [
            props.indicator
        ]
    );

    useEffect(() => {
        if (props.indicator?.indicatorData !== undefined) {
            setLoading(false);
        }
    }, [props.indicator?.indicatorData])

    useEffect(() => {
            if (!props.indicator.isHidden && props.indicator?.indicatorData === undefined && !loading) {
                setLoading(true);
                props.api.getIndicatorChildDataWrapper(
                    props.controller.state.profileId,
                    props.controller.state.profile.profile.geography.code,
                    props.indicator.id
                ).then((childData) => {
                    let indicator = structuredClone(props.indicator);
                    indicator.indicatorData = childData;
                    props.handleIndicatorChange(indicator);
                }).catch((response) => {
                    props.indicator.indicatorData = {};
                    throw(response);
                })
            }
        }
    );

    const checkForSubIndicatorData = () => {
        let isValid = false;
        let indicatorData = props.indicator?.indicatorData;
        if (indicatorData !== undefined) {
            isValid = Object.keys(indicatorData).some((geo) => {
                return indicatorData[geo].length > 0;
            })
        }

        return isValid;
    }

    if (subindicators.length > 0) {
        return (
            <Tooltip
                title={props.indicator.label || "No description available"}
                placement="right"
                arrow
                followCursor
            >
                <span>
                    <StyledIndicatorTreeItem nodeId={`datamapper-indicator-${props.indicator.id}`} label={
                        <Box sx={{display: 'flex', alignItems: 'center', p: 0.5, pr: 0}}>
                            <Typography variant="body2" sx={{fontSize: '1em', letterSpacing: '.3px', color: '#666'}}
                                        className="indicator-item">
                                {props.indicator.label}
                            </Typography>
                        </Box>
                    } data-test-id={`datamapper-indicator-${props.indicator.id}`}>
                        {loading && <LoadingItemView/>}
                        {!loading && checkForSubIndicatorData() && subindicators.map(
                            (subindicator, index) => {
                                return (
                                    <SubindicatorItemView
                                        subindicator={subindicator}
                                        key={`datamapper-subindicator-${props.indicator.id}-${index}-${props.controller.state.profile.profile.geography.code}`}

                                        controller={props.controller}
                                        loading={loading}
                                        indicatorData={props.indicator?.indicatorData}
                                        indicator={props.indicator}
                                        parents={{
                                            ...props.parents,
                                            indicator: props.indicator.label
                                        }}
                                    />
                                )
                            })
                        }
                        {!loading && !checkForSubIndicatorData() && <NoSubindicatorView
                            indicator={props.indicator}
                        />}
                    </StyledIndicatorTreeItem>
                </span>
            </Tooltip>
        )
    }
}

const IndicatorSubCategoryTreeView = (props) => {
    const [indicators, setIndicators] = useState(props.subcategory.indicators.filter(x => getSubIndicators(x).length > 0));

    const handleIndicatorChange = (indicator) => {
        let newArr = indicators.map(ni => {
            if (ni.id === indicator.id) {
                ni.indicatorData = indicator.indicatorData;
            }
            return ni;
        })
        setIndicators(newArr)
    }

    if (indicators != null && indicators.length > 0) {
        return (
            <StyledSubCategoryTreeItem nodeId={`datamapper-subcategory-${props.subcategory.id}`} label={
                <Box sx={{display: 'flex', alignItems: 'center', p: 0.5, pr: 0}}>
                    <Typography variant="body2" sx={{fontSize: '1em', fontWeight: '500', letterSpacing: '.3px'}}
                                className="indicator-subcategory">
                        {props.subcategory.name}
                    </Typography>
                </Box>
            } data-test-id={`datamapper-subcategory-${props.subcategory.id}`}>
                {!props.subcategory.length > 0 && indicators != null && indicators.map(
                    (indicator, index) => {

                        if (!indicator.isHidden) {
                            return (
                                <IndicatorItemView
                                    indicator={indicator}
                                    handleIndicatorChange={(indicator) => handleIndicatorChange(indicator)}
                                    key={`datamapper-indicator-${indicator.id}-${index}-${props.controller.state.profile.profile.geography.code}`}
                                    api={props.api}
                                    controller={props.controller}
                                    categoryName={props.categoryName}
                                    SubCategoryName={props.subcategory.name}
                                    parents={{
                                        ...props.parents,
                                        subcategory: props.subcategory.name
                                    }}
                                />
                            )
                        }
                    })
                }
            </StyledSubCategoryTreeItem>
        )
    }
}

const IndicatorCategoryTreeView = (props) => {
    return (
        <StyledCategoryTreeItem nodeId={`datamapper-category-${props.category.id}`} label={
            <Box sx={{display: 'flex', alignItems: 'center', p: 0.5, pr: 0}}>
                <Typography variant="body2" sx={{fontSize: '.9em', fontWeight: '500', letterSpacing: '.3px'}}>
                    {props.category.name}
                </Typography>
            </Box>
        } data-test-id={`datamapper-category-${props.category.id}`} className={"indicator-category"}>
            {!props.category.isHidden && props.category.subcategories.map(
                (subcategory, index) => {
                    if (!subcategory.isHidden) {
                        return (
                            <IndicatorSubCategoryTreeView
                                subcategory={subcategory}
                                key={`datamapper-subcategory-${subcategory.id}-${index}-${props.controller.state.profile.profile.geography.code}`}
                                api={props.api}
                                controller={props.controller}
                                parents={{category: props.category.name}}
                            />
                        )
                    }
                })
            }
        </StyledCategoryTreeItem>

    )
}

export default IndicatorCategoryTreeView;