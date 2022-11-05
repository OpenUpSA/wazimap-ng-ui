import React, {useState} from "react";
import {Autocomplete, Box, Card, Grid, TextField} from "@mui/material";

const Indicator = (props) => {
    const [selectedIndicator, setSelectedIndicator] = useState(null);

    const indicatorAutoComplete = <Autocomplete
        disablePortal
        isOptionEqualToValue={(option => true)}
        options={[...new Set(props.indicators.map(item => item.indicator))]}
        getOptionLabel={(option) => option}
        onChange={(event, selectedValue) => {
            let newValue = props.indicators.filter(x => x.indicator === selectedValue)[0];
            console.log({newValue})
            setSelectedIndicator(newValue);
        }}
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
        disablePortal
        isOptionEqualToValue={(option => true)}
        options={
            selectedIndicator == null ? [] :
                selectedIndicator.indicatorDetail.metadata.groups
                    .filter((x) => x.name === selectedIndicator.indicatorDetail.metadata.primary_group)[0].subindicators
        }
        getOptionLabel={(option) => option}
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
                label={'Category'}
            />}
    />

    return (
        <div>
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