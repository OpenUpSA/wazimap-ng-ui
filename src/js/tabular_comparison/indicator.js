import React, {useState} from "react";
import {Autocomplete, Box, Card, Grid, Icon, TextField} from "@mui/material";

//components
import IndicatorAutoComplete from "./indicator-auto-complete";
import CategoryAutoComplete from "./category-auto-complete";

const Indicator = (props) => {
    const [selectedIndicator, setSelectedIndicator] = useState(null);
    const [categoryValue, setCategoryValue] = useState(null);

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
                className={'comparison-card last'}
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
        </div>
    );
}

export default Indicator;
