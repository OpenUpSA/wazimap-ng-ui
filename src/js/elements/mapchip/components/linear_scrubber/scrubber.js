import React, {useMemo, useState, useEffect, useCallback} from 'react';
import { ThemeProvider } from '@mui/system';
import { useTheme } from '@mui/material/styles';
import { StyledSlider, ParentContainer, CustomSliderRail } from './styledElements';


const Scrubber = (props) => {
  const theme = useTheme();
  const {
      primaryGroup, groups, selectedSubindicator,
      indicatorTitle
  } = props;

  const selectedGroup = useMemo(
    () => {
        return groups.find(group => group.name === primaryGroup);
    },
    [groups, primaryGroup]
  );

  const selectedSubindicatorIndex = useMemo(
    () => {
      return selectedGroup.subindicators.indexOf(selectedSubindicator)
    },
    [selectedGroup, selectedSubindicator]
  )

  const [value, setValue] = useState(selectedSubindicatorIndex);
  const [parentValue, setParentValue] = useState(selectedSubindicatorIndex);

  useEffect(
    () => {
      if (selectedSubindicatorIndex !== parentValue) {
        setValue(selectedSubindicatorIndex);
        setParentValue(selectedSubindicatorIndex);
      }
    },
    [
      selectedSubindicatorIndex, setValue,
      setParentValue, parentValue
    ]
  );

  const marks = useMemo(() => {
      return selectedGroup.subindicators.map(function(subindicator, idx) {
          return { "value": idx, "label": subindicator };
      });
    },
    [selectedGroup]
  );


  const changeValue = useCallback(
    (event, value) => {
      const selectedSubindicator = selectedGroup.subindicators[value];
      let params = {
          indicatorTitle: indicatorTitle,
          selectedSubindicator: selectedSubindicator
      }
      props.onSubIndicatorChange(params);
      setValue(value);
    },
    [
      selectedGroup, indicatorTitle,
      setValue, props.onSubIndicatorChange
    ]
  )

  const showMarkTooltip = useCallback(event => {
    const subindicatorIndex = event.target.getAttribute("data-index");
    props.tooltip.enableTooltip(
        $(event.target),
        selectedGroup.subindicators[subindicatorIndex]
    );
  }, [props.tooltip, selectedGroup]);


  return (
    <ThemeProvider theme={theme}>
        <ParentContainer>
          <CustomSliderRail>
            <StyledSlider
              min={0}
              max={ marks.length -1 }
              step={1}
              value={value}
              marks={marks}
              onChange={changeValue}
              valueLabelDisplay="off"
              disableSwap={true}
              onMouseEnter={showMarkTooltip}
            />
          </CustomSliderRail>
        </ParentContainer>
      </ThemeProvider>
  );
}

export default Scrubber;
