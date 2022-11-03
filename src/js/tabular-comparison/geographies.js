import React, {useState} from "react";
import {Card, Grid} from "@mui/material";
import {Autocomplete, Box, TextField, Chip} from '@mui/material';

//components
import SectionTitle from "./section-title";

const Geographies = (props) => {
    const [options, setOptions] = useState([]);

    const filterOptions = (inputValue) => {
        props.api.search(props.profileId, inputValue).then((data) => {
            setOptions(data);
        });
    }

    const handleSelection = (newValue) => {
        if (newValue === null) {
            return;
        }

        let newArr = props.selectedGeographies;
        newArr.push(newValue);

        console.log({newArr})
        props.setSelectedGeographies(newArr);
    }

    const handleDelete = (geoToDelete) => {
        props.setSelectedGeographies((geos) => geos.filter((geo) => geo.code !== geoToDelete.code));
    }

    const autoComplete = <Autocomplete
        disablePortal
        filterOptions={(x) => x}
        isOptionEqualToValue={(option => true)}
        options={options}
        getOptionLabel={(option) => option.code + ' - ' + option.name}
        onInputChange={(event, newInputValue) => {
            filterOptions(newInputValue);
        }}
        onChange={(event, newValue) => {
            handleSelection(newValue);
        }}
        size={'small'}
        renderOption={(props, option) => (
            <Box
                component="li"
                {...props}
            >
                {option.code} - {option.name}
            </Box>
        )}
        renderInput={(params) =>
            <TextField
                {...params}
                label="Geography"
            />}
    />

    return (
        <Grid container>
            <Grid
                className={'margin-bottom-20'}
            >
                <SectionTitle>Comparison geographies</SectionTitle>
            </Grid>
            <Grid container>
                <Card
                    className={'dark-grey-bg full-width border-radius-10'}
                    variant={'outlined'}
                    sx={{height: props.cardHeight}}
                >
                    <Card
                        className={'comparison-card first'}
                        variant={'outlined'}
                    >
                        <Grid container>
                            <Grid xs={5}>
                                Compare geographies in :</Grid>
                            <Grid xs={7}>
                                {autoComplete}
                            </Grid>
                        </Grid>
                    </Card>
                    <Grid
                        className={'selected-geographies'}>
                        {props.selectedGeographies.map((geo) => {
                            return (
                                <Chip
                                    key={geo.code}
                                    label={geo.name}
                                    onDelete={() => handleDelete(geo)}
                                    className={'geo-chip'}
                                />
                            )
                        })}
                    </Grid>
                </Card>
            </Grid>
        </Grid>
    );
}

export default Geographies;