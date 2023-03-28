import React, {useState, useCallback, useMemo, useEffect} from "react";
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
    <StyledTreeItem nodeId={`myview-indicator-${props.indicator.id}`} label={
      <Box>
        <Typography variant="body2" className={"truncate"}>
          {props.indicator.label}
        </Typography>
        <Typography
          variant="caption"
          color="inherit"
          onClick={(e) => hideIndicator(e)}
          data-test-id={isHidden ? "eyeCloseIcon" : "eyeIcon"}
        >
          {isHidden ? eyeCloseIcon : eyeIcon}
        </Typography>
      </Box>
    } data-test-id={`MyView-${props.indicator.label}`} />
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
    <StyledSubCategoryTreeItem nodeId={`myview-subcategory-${props.subcategory.id}`} label={
      <Box>
        <Typography variant="body2" className={"truncate"}>
          {props.subcategory.name}
        </Typography>
        <Typography variant="caption">
          hidden {hiddenIndicators.length}
        </Typography>
      </Box>
    } data-test-id={`MyView-${props.subcategory.name}`}>
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

  useEffect(() => {
    if (hiddenIndicators !== hiddenIndicatorIds){
      setHiddenIndicators(hiddenIndicatorIds);
    }
  }, [hiddenIndicatorIds])

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
    <StyledCategoryTreeItem nodeId={`myview-category-${props.category.id}`} label={
      <Box>
        <Typography variant="body2" className={"truncate"}>
          {props.category.name}
        </Typography>
        <Typography variant="caption">
          hidden {hiddenIndicators.length}
        </Typography>
      </Box>
    } data-test-id={`MyView-${props.category.name}`}>
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
