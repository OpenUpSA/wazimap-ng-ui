import React, {useState} from "react";
import {Autocomplete, Box, Card, Grid, Icon, TextField} from "@mui/material";

const Indicator = (props) => {
    const [selectedIndicator, setSelectedIndicator] = useState(null);

    const indicatorAutoComplete = <Autocomplete
        disabled={props.indicators.length <= 0}
        isOptionEqualToValue={(option => true)}
        options={[...new Set(props.indicators.map(item => item.indicator))]}
        getOptionLabel={(option) => option}
        onChange={(event, selectedValue) => handleIndicatorSelection(event, selectedValue)}
        size={'small'}
        renderOption={(props, option) => (
            <Box
                component="li"
                {...props}
            >
                {option}
            </Box>
        )}
        renderInput={(params) =>
            <TextField
                {...params}
                label={'Indicator'}
            />}
    />

    const categoryAutoComplete = <Autocomplete
        disabled={selectedIndicator === null}
        isOptionEqualToValue={(option => true)}
        options={
            selectedIndicator == null ? [] :
                selectedIndicator.indicatorDetail.metadata.groups
                    .filter((x) => x.name === selectedIndicator.indicatorDetail.metadata.primary_group)[0].subindicators
        }
        getOptionLabel={(option) => option}
        size={'small'}
        onChange={(event, selectedValue) => handleCategorySelection(event, selectedValue)}
        renderOption={(props, option) => (
            <Box
                component="li"
                {...props}
            >
                {option}
            </Box>
        )}
        renderInput={(params) =>
            <TextField
                {...params}
                label={'Category'}
            />}
    />

    const handleIndicatorSelection = (event, selectedValue) => {
        let newValue = props.indicators.filter(x => x.indicator === selectedValue)[0];
        setSelectedIndicator(newValue);

        props.handleIndicatorSelection(newValue);
    }

    const handleCategorySelection = (event, selectedValue) => {
        props.handleCategorySelection(selectedValue);
    }

    return (
        <div>
            <div
                className={'remove-indicator'}
                onClick={props.handleRemove}
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