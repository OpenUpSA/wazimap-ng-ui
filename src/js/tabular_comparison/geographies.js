import React, {useState} from "react";
import {Card, Grid} from "@mui/material";
import {Autocomplete, Box, TextField, Chip} from '@mui/material';

//components
import SectionTitle from "./section-title";

const Geographies = (props) => {
    const [options, setOptions] = useState([]);
    const arrowSvg =
        <svg width="36" height="38" viewBox="0 0 36 38" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M27.0432 0.160585C26.5795 -0.139443 25.9604 -0.0067747 25.6604 0.456908L20.7712 8.01305C20.4711 8.47673 20.6038
            9.09584 21.0675 9.39587C21.5312 9.6959 22.1503 9.56323 22.4503 9.09955L26.7963 2.38298L33.5129 6.72897C33.9766
            7.029 34.5957 6.89633 34.8957 6.43265C35.1957 5.96897 35.0631 5.34986 34.5994 5.04983L27.0432 0.160585ZM2.95036e-05
            37.5003C2.71266 37.5003 6.05977 36.5268 9.44696 34.7971C12.8496 33.0595 16.3635 30.5233 19.4125 27.3139C25.513
            20.8923 29.8145 11.6951 27.4778 0.790625L25.5222 1.20969C27.6855 11.305 23.737 19.8579 17.9625 25.9364C15.0739
            28.977 11.7441 31.3784 8.5374 33.0159C5.31523 34.6613 2.28736 35.5003 2.94642e-05 35.5003L2.95036e-05 37.5003Z"
                fill="#39AD84"/>
        </svg>;

    const filterOptions = (inputValue) => {
        props.api.search(props.profileId, inputValue).then((data) => {
            setOptions(data);
        });
    }

    const handleSelection = (newValue) => {
        if (newValue === null) {
            return;
        }

        let newArr = JSON.parse(JSON.stringify(props.selectedGeographies));
        newArr.push(newValue);

        props.setSelectedGeographies(newArr);
    }

    const handleDelete = (geoToDelete) => {
        props.setSelectedGeographies((geos) => geos.filter((geo) => geo.code !== geoToDelete.code));
    }

    const renderGeographies = () => {
        if (props.selectedGeographies.length > 0) {
            return renderChips();
        } else {
            return renderEmptyState();
        }
    }

    const renderChips = () => {
        return props.selectedGeographies.map((geo) => {
            return (
                <Chip
                    key={geo.code}
                    label={geo.name}
                    onDelete={() => handleDelete(geo)}
                    className={'geo-chip'}
                />
            )
        })
    }

    const renderEmptyState = () => {
        return (
            <div className={'geography-empty-state'}>
                <span>Choose a geography to get started!</span>
                <span>{arrowSvg}</span>
            </div>
        )
    }

    const autoComplete = <Autocomplete
        disabled={props.api === null}
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
                    className={'dark-grey-bg full-width border-radius-10 auto-scroll-y'}
                    variant={'outlined'}
                    sx={{height: props.cardHeight}}
                >
                    <Card
                        className={'comparison-card first last'}
                        variant={'outlined'}
                    >
                        <Grid container>
                            <Grid
                                xs={5}
                                item={true}
                            >
                                Compare geographies in :</Grid>
                            <Grid
                                xs={7}
                                item={true}
                            >
                                {autoComplete}
                            </Grid>
                        </Grid>
                    </Card>
                    <Grid
                        className={'selected-geographies'}>
                        {renderGeographies()}
                    </Grid>
                </Card>
            </Grid>
        </Grid>
    );
}

export default Geographies;