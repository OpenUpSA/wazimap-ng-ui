import React, {useState, useCallback, useMemo, useEffect} from "react";

import {
  StyledCategoryTreeItem,
  StyledSubCategoryTreeItem,
  StyledSubindicatorTreeItem,
  StyledIndicatorTreeItem
} from "./styledElements";
import Box from "@mui/material/Box";
import {Typography} from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';


const LoadingItemView = (props) => {
  return (
    <StyledSubindicatorTreeItem nodeId={"loading"} label={
      <Box sx={{ display: 'flex', alignItems: 'center', p: 0.5, pr: 0 }}>
        <Typography variant="body2" sx={{ fontSize: '1em', letterSpacing: '.3px', color: '#666'}}>
          Loading...
        </Typography>
      </Box>
    }/>
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
    <StyledSubindicatorTreeItem nodeId={props.subindicator} label={
      <Box sx={{ display: 'flex', alignItems: 'center', p: 0.5, pr: 0 }}>
        <Typography variant="body2" sx={{ fontSize: '1em', letterSpacing: '.3px', color: '#666'}} className={"truncate"}>
          {props.subindicator}
        </Typography>
      </Box>
    } onClick={(e) => onClickSubindicator()} data-test-id={props.subindicator} className={"subIndicator-item"}/>
  )
}

const IndicatorItemView = (props) => {

  const [loading, setLoading] = useState(false)
  useEffect(
    () => {
      if (!props.indicator.isHidden && props.indicator?.indicatorData === undefined && !loading){
        setLoading(true);
        props.api.getIndicatorChildData(
          props.controller.state.profileId,
          props.controller.state.profile.profile.geography.code,
          props.indicator.id
        ).then((childData) => {
          props.indicator.indicatorData = childData;
          setLoading(false);
        }).catch((response) => {
          props.indicator.indicatorData = {};
          setLoading(false);
          throw(response);
        })
      }
    }
  );

  const subindicators = useMemo(
    () => {
      const indicator = props.indicator;
      const primaryGroup = indicator.metadata.primary_group;
      const primaryGroupObj = indicator.metadata.groups.filter(
        group => group.name === primaryGroup
      )

      if (primaryGroupObj.length > 0){
        return primaryGroupObj[0].subindicators
      }
      return [];
    }, [
      props.indicator
    ]
  );

  return (
    <StyledIndicatorTreeItem nodeId={props.indicator.id.toString()} label={
      <Box sx={{ display: 'flex', alignItems: 'center', p: 0.5, pr: 0 }}>
        <Typography variant="body2" sx={{ fontSize: '1em', letterSpacing: '.3px', color: '#666'}} className="indicator-item">
          {props.indicator.label}
        </Typography>
      </Box>
    } data-test-id={props.indicator.label}>
    {loading && <LoadingItemView/>}
    {!loading && subindicators.length > 0 && subindicators.map(
      (subindicator, key) => {
        return (
          <SubindicatorItemView
            subindicator={subindicator}
            key={key}
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
    </StyledIndicatorTreeItem>
  )
}

const IndicatorSubCategoryTreeView = (props) => {

  return (
    <StyledSubCategoryTreeItem nodeId={props.subcategory.name} label={
      <Box sx={{ display: 'flex', alignItems: 'center', p: 0.5, pr: 0 }}>
        <Typography variant="body2" sx={{ fontSize: '1em', fontWeight: '500', letterSpacing: '.3px' }} className="indicator-subcategory">
          {props.subcategory.name}
        </Typography>
      </Box>
    } data-test-id={props.subcategory.name}>
    {!props.subcategory.length > 0 && props.subcategory.indicators.map(
      (indicator, key) => {

        if (!indicator.isHidden){
          return (
            <IndicatorItemView
              indicator={indicator}
              key={key}
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

const IndicatorCategoryTreeView = (props) => {
  return (
    <StyledCategoryTreeItem nodeId={props.category.name} label={
      <Box sx={{ display: 'flex', alignItems: 'center', p: 0.5, pr: 0 }}>
        <Typography variant="body2" sx={{ fontSize: '.9em', fontWeight: '500', letterSpacing: '.3px' }}>
          {props.category.name}
        </Typography>
      </Box>
    } data-test-id={props.category.name} className={"indicator-category"}>
    {!props.category.isHidden && props.category.subcategories.map(
      (subcategory, key) => {
        if (!subcategory.isHidden){
          return (
            <IndicatorSubCategoryTreeView
              subcategory={subcategory}
              key={key}
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
