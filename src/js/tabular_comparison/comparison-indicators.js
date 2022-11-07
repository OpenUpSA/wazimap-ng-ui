import React, {useState, useEffect} from "react";
import {Button, Card, Grid} from "@mui/material";
import AddIcon from '@mui/icons-material/AddCircle';

//components
import SectionTitle from "./section-title";
import Indicator from "./indicator";

const ComparisonIndicators = (props) => {
    const [previousSelectedGeographies, setPreviousSelectedGeographies] = useState([]);

    useEffect(() => {
        const addedGeographies = props.selectedGeographies.filter(({code: id1}) => !previousSelectedGeographies.some(({code: id2}) => id2 === id1));
        const removedGeographies = previousSelectedGeographies.filter(({code: id1}) => !props.selectedGeographies.some(({code: id2}) => id2 === id1));

        let newArr = JSON.parse(JSON.stringify(props.selectedGeographies));
        setPreviousSelectedGeographies(newArr);
        if (addedGeographies.length <= 0 && removedGeographies.length <= 0) {
            return;
        }

        addedGeographies.forEach((geo) => {
            props.api.getProfile(props.profileId, geo.code).then((data) => {
                extractIndicators(geo.code, data.profile.profile_data);
            })
        })

        removedGeographies.forEach((geoToDelete) => {
            props.setIndicators((indicators) => indicators.filter((indicator) => indicator.geo !== geoToDelete.code));
        })
    }, [props.selectedGeographies])

    const extractIndicators = (geo, profileData) => {
        let arr = [];
        for (const [category, categoryDetail] of Object.entries(profileData)) {
            for (const [subcategory, subcategoryDetail] of Object.entries(categoryDetail.subcategories)) {
                if (subcategoryDetail.indicators) {
                    for (const [indicator, indicatorDetail] of Object.entries(subcategoryDetail.indicators)) {
                        arr.push({
                            geo, indicator, indicatorDetail
                        })
                    }
                }
            }
        }

        let newArr = JSON.parse(JSON.stringify(arr.concat(props.indicators)));
        props.setIndicators(newArr);
    }

    const addIndicator = () => {
        let newArr = JSON.parse(JSON.stringify(props.indicatorObjs));
        let maxIndex = newArr.length > 0 ? Math.max(...newArr.map(x => x.index)) : 0;

        const newObj = {
            index: ++maxIndex,
            indicator: '',
            category: ''
        }

        newArr.push(newObj);

        props.setIndicatorObjs(newArr);
    }

    const handleRemove = (index) => {
        props.setIndicatorObjs((objs) => objs.filter((obj) => obj.index !== index));
    }

    const handleIndicatorSelection = (index, newValue) => {
        let newArr = JSON.parse(JSON.stringify(props.indicatorObjs));
        newArr.filter((obj) => obj.index === index)[0].indicator = newValue.indicator;

        props.setIndicatorObjs(newArr);
    }

    const handleCategorySelection = (index, newValue) => {
        let newArr = JSON.parse(JSON.stringify(props.indicatorObjs));
        newArr.filter((obj) => obj.index === index)[0].category = newValue;

        props.setIndicatorObjs(newArr);
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
                    className={'dark-grey-bg full-width border-radius-10 comparison-indicators auto-scroll-y'}
                    variant={'outlined'}
                    sx={{height: props.cardHeight}}
                >
                    {props.indicatorObjs.map((x) =>
                        <Indicator
                            key={x.index}
                            indicators={props.indicators}
                            handleRemove={() => handleRemove(x.index)}
                            handleIndicatorSelection={(newValue) => handleIndicatorSelection(x.index, newValue)}
                            handleCategorySelection={(newValue) => handleCategorySelection(x.index, newValue)}
                        />
                    )}
                </Card>
            </Grid>
        </Grid>
    );
}

export default ComparisonIndicators;