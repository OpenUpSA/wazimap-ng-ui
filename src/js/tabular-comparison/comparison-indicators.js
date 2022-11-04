import React, {useState} from "react";
import {Button, Card, Grid, Autocomplete, Box, TextField} from "@mui/material";
import AddIcon from '@mui/icons-material/AddCircle';

//components
import SectionTitle from "./section-title";
import Indicator from "./indicator";

const ComparisonIndicators = (props) => {
    const [indicators, setIndicators] = useState([]);

    const addIndicator = () => {
        let newArr = JSON.parse(JSON.stringify(indicators));
        newArr.push(new Indicator());

        setIndicators(newArr);
    }

    return (
        <Grid container>
            <Grid
                className={'margin-bottom-20'}
            >
                <SectionTitle>Comparison indicators</SectionTitle>
            </Grid>
            <Grid
                container
                className={'margin-bottom-20'}
            >
                <Button
                    variant={'outlined'}
                    className={'full-width btn-add-indicator'}
                    startIcon={<AddIcon/>}
                    onClick={addIndicator}
                >
                    Click to add an indicator to compare
                </Button>
            </Grid>
            <Grid container>
                <Card
                    className={'dark-grey-bg full-width border-radius-10'}
                    variant={'outlined'}
                    sx={{height: props.cardHeight}}
                >
                    {indicators.map((indicator) => {
                        return (
                            <Indicator/>
                        )
                    })}
                </Card>
            </Grid>
        </Grid>
    );
}

export default ComparisonIndicators;