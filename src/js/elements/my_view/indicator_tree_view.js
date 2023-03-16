import React, {useState, useCallback, useMemo} from "react";
import {
  StyledTreeItem,
  StyledCategoryTreeItem,
  StyledSubCategoryTreeItem
} from "./styled_elements";
import Box from "@mui/material/Box";
import {Typography} from "@mui/material";
import {EyeIcon, EyeCloseIcon} from "./svg_icons";

import {map, flatten, intersection} from "lodash";


const IndicatorItemView = (props) => {
  const eyeIcon = EyeIcon;
  const eyeCloseIcon = EyeCloseIcon;

  const isHidden = useMemo(
    () => {
      return props.hiddenIndicators.includes(props.indicator.id)
    }, [
      props.indicator,
      props.hiddenIndicators
    ]
  )

  const hideIndicator = useCallback(
    (e) => {
      if (isHidden){
        props.removeHiddenIndicator(props.indicator.id);
      } else {

        props.addHiddenIndicator(props.indicator.id);
      }
    }, [
      props.indicator,
      isHidden,
      props.removeHiddenIndicator,
      props.addHiddenIndicator,
    ]
  )
  return (
    <StyledTreeItem nodeId={props.indicator.id.toString()} label={
      <Box sx={{ display: 'flex', alignItems: 'center', p: 0.5, pr: 0 }}>
        <Typography variant="body2" sx={{ fontWeight: 'inherit', flexGrow: 1 }}>
          {props.indicator.label}
        </Typography>
        <Typography variant="caption" color="inherit" onClick={(e) => hideIndicator(e)}>
          {isHidden ? eyeCloseIcon : eyeIcon}
        </Typography>
      </Box>
    } />
  )
}

const IndicatorSubCategoryTreeView = (props) => {

  const hiddenIndicators = useMemo(
    () => {
      return props.subcategory.indicators.filter(
          indicator => props.hiddenIndicators.includes(indicator.id)
      )
    }, [
      props.subcategory,
      props.hiddenIndicators
    ]
  )

  return (
    <StyledSubCategoryTreeItem nodeId={props.subcategory.id.toString()} label={
      <Box>
        <Typography variant="body2">
          {props.subcategory.name}
        </Typography>
        <Typography variant="caption">
          hidden {hiddenIndicators.length}
        </Typography>
      </Box>
    }>
    {props.subcategory.indicators.length > 0 && props.subcategory.indicators.map(
      (indicator, key) => {
        return (
          <IndicatorItemView
            indicator={indicator}
            key={key}
            addHiddenIndicator={props.addHiddenIndicator}
            removeHiddenIndicator={props.removeHiddenIndicator}
            hiddenIndicators={props.hiddenIndicators}
          />
        )
      })
    }
    </StyledSubCategoryTreeItem>

  )
}

const IndicatorCategoryTreeView = (props) => {

  const hiddenIndicatorIds = useMemo(
    () => {
      let indicatorIds = [];
      const indicators = flatten(map(props.category.subcategories, "indicators"));
      if (indicators.length > 0){
        indicatorIds = map(indicators, "id")
      }

      return intersection(props.hiddenIndicators, indicatorIds);
    }, [
      props.category,
      props.hiddenIndicators
    ]
  )

  const [hiddenIndicators, setHiddenIndicators] = useState(hiddenIndicatorIds);
  const addHiddenIndicator = useCallback(
    (indicatorId) => {
      setHiddenIndicators([...hiddenIndicators, indicatorId]);
      props.updateHiddenIndicators(indicatorId, "add");
    }, [
      hiddenIndicators,
      setHiddenIndicators,
      props.updateHiddenIndicators
    ]
  )
  const removeHiddenIndicator = useCallback(
    (indicatorId) => {
      let filteredIndicators = hiddenIndicators.filter(item => item !== indicatorId);
      setHiddenIndicators(filteredIndicators);
      props.updateHiddenIndicators(indicatorId, "remove");
    }, [
      hiddenIndicators,
      setHiddenIndicators,
      props.updateHiddenIndicators
    ]
  )

  return (
    <StyledCategoryTreeItem nodeId={props.category.id.toString()} label={
      <Box>
        <Typography variant="body2">
          {props.category.name}
        </Typography>
        <Typography variant="caption">
          hidden {hiddenIndicators.length}
        </Typography>
      </Box>
    }>
    {props.category.subcategories.length > 0 && props.category.subcategories.map(
      (subcategory, key) => {
        return (
          <IndicatorSubCategoryTreeView
            subcategory={subcategory}
            key={key}
            addHiddenIndicator={addHiddenIndicator}
            removeHiddenIndicator={removeHiddenIndicator}
            hiddenIndicators={hiddenIndicators}
          />
        )
      })
    }
    </StyledCategoryTreeItem>
  )
}

export default IndicatorCategoryTreeView;
