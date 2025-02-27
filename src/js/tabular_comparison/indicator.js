import React, {useState, useEffect} from "react";
import {Autocomplete, Box, Card, Grid, Icon, TextField} from "@mui/material";

//components
import IndicatorAutoComplete from "./indicator-auto-complete";
import CategoryAutoComplete from "./category-auto-complete";
import IndicatorFilters from "./indicator-filters";

const Indicator = (props) => {
    const [selectedIndicator, setSelectedIndicator] = useState(null);
    const [categoryValue, setCategoryValue] = useState(null);
    const [selectedFilters, setSelectedFilters] = useState([]);


    const indicatorAutoComplete =
        <IndicatorAutoComplete
            disabled={props.indicators.length <= 0}
            options={[...new Set(props.indicators.map(item => item.indicator))]}
            handleIndicatorSelection={(event, selectedValue) => handleIndicatorSelection(event, selectedValue)}
        />
    const categoryAutoComplete =
        <CategoryAutoComplete
            disabled={selectedIndicator === null}
            selectedIndicator={selectedIndicator}
            categoryValue={categoryValue}
            handleCategorySelection={(event, selectedValue) => handleCategorySelection(event, selectedValue)}
            indicatorObjs={props.indicatorObjs}
        />

    const handleIndicatorSelection = (event, selectedValue) => {
        let newValue = props.indicators.filter(x => x.indicator === selectedValue)[0];
        setSelectedIndicator(newValue);
        setCategoryValue(null);

        props.handleIndicatorSelection(newValue);
    }

    const handleCategorySelection = (event, selectedValue) => {
        setCategoryValue(selectedValue);
        props.handleCategorySelection(selectedValue);
    }

    useEffect(() => {
      if (selectedIndicator){
        const metadata = selectedIndicator.indicatorDetail.metadata;
        const primaryGroup = metadata.primary_group;
        const groups = metadata.groups.filter(item => item.name !== primaryGroup);
        const defaultFilters = selectedIndicator.indicatorDetail?.chart_configuration?.filter?.defaults || [];
        let filters = [];
        groups.map(
          item => {
            if (!item.can_aggregate){
              filters.push({
                group: item.name,
                value: item.subindicators[0],
                canRemove: false,
              })
            }
          }
        )

        defaultFilters.map(
          filter => {
            let group = groups.find(item => item.name === filter.name);
            const nonAggFilter = filters.find(item => item.group === filter.name);
            if (group !== undefined){
              if (group.subindicators.includes(filter.value)) {
                if (nonAggFilter === undefined){
                  filters.push({
                    group: filter.name,
                    value: filter.value,
                    canRemove: true,
                  })
                } else {
                  nonAggFilter.value = filter.value;
                }
              }
            }
          }
        )
        setSelectedFilters(filters);
      }
    }, [selectedIndicator])

    useEffect(() => {
      props.handleFilterSelection(selectedFilters);
    }, [
      selectedFilters
    ])

    return (
        <div
          data-testid={`indicator-panel-${props.index}`}
        >
            <div
                className={'remove-indicator'}
                onClick={props.handleRemove}
                data-testid={`remove-panel-${props.index}`}
            >x
            </div>
            <Card
                className={'comparison-card first'}
                variant={'outlined'}
            >
                <Grid container>
                    <Grid
                        xs={5}
                        item={true}
                    >
                        Indicator :</Grid>
                    <Grid
                        xs={7}
                        item={true}
                    >
                        {indicatorAutoComplete}
                    </Grid>
                </Grid>
            </Card>
            <Card
                className={'comparison-card'}
                variant={'outlined'}
            >
                <Grid container>
                    <Grid
                        xs={5}
                        item={true}
                    >
                        Choose category :</Grid>
                    <Grid
                        xs={7}
                        item={true}
                    >
                        {categoryAutoComplete}
                    </Grid>
                </Grid>
            </Card>

            {selectedIndicator && categoryValue && <Card
                className={'comparison-card last'}
                variant={'outlined'}
                data-testid={`filter-panel-${props.index}`}
            >
                <Grid container>
                    <Grid
                        xs={5}
                        item={true}
                    >
                      Filters:
                    </Grid>
                    <Grid
                        xs={7}
                        item={true}
                    >
                        <IndicatorFilters
                          indicator={selectedIndicator}
                          category={categoryValue}
                          selectedFilters={selectedFilters}
                          setSelectedFilters={setSelectedFilters}
                        />
                    </Grid>
                </Grid>
            </Card>}
        </div>
    );
}

export default Indicator;
