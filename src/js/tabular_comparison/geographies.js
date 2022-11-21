import React, {useState} from "react";
import {Card, Grid} from "@mui/material";
import {Autocomplete, Box, TextField, Chip} from '@mui/material';
import {GeographiesArrowSvg} from "./svg-icons";

//components
import SectionTitle from "./section-title";

const Geographies = (props) => {
    const [options, setOptions] = useState([]);
    const arrowSvg =GeographiesArrowSvg;

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
        getOptionDisabled={(option) => {
            return props.selectedGeographies.some(x => x.code === option.code);
        }}
        getOptionLabel={(option) => option.code + ' - ' + option.name}
        onInputChange={(event, newInputValue) => {
            filterOptions(newInputValue);
        }}
        onChange={(event, newValue) => {
            handleSelection(newValue);
        }}
        size={'small'}
        data-testid="geography-autocomplete"
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
