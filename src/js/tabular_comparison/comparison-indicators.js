import React, {useState, useEffect} from "react";
import {Button, Card, Chip, Grid} from "@mui/material";
import AddIcon from '@mui/icons-material/AddCircle';
import {ComparisonIndicatorArrowSvg} from "./svg-icons";

//components
import SectionTitle from "./section-title";
import Indicator from "./indicator";

const ComparisonIndicators = (props) => {
    const [previousSelectedGeographies, setPreviousSelectedGeographies] = useState([]);
    const arrowSvg = ComparisonIndicatorArrowSvg;

    useEffect(() => {
        if (props.selectedGeographies.length <= 0) {
            props.setIndicatorObjs([]);
        }

        const addedGeographies = props.selectedGeographies.filter(({code: id1}) => !previousSelectedGeographies.some(({code: id2}) => id2 === id1));
        const removedGeographies = previousSelectedGeographies.filter(({code: id1}) => !props.selectedGeographies.some(({code: id2}) => id2 === id1));

        let newArr = JSON.parse(JSON.stringify(props.selectedGeographies));
        setPreviousSelectedGeographies(newArr);
        if (addedGeographies.length <= 0 && removedGeographies.length <= 0) {
            return;
        }

        addedGeographies.forEach((geo) => {
            props.api.getProfileWithoutVersion(props.profileId, geo.code).then((data) => {
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
                        if (indicatorDetail.dataset_content_type !== 'qualitative') {
                            arr.push({
                                geo, indicator, indicatorDetail
                            })
                        }
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
            category: '',
            filters: [],
        }

        newArr.push(newObj);
        props.setIndicatorObjs(newArr);
    }

    const handleRemove = (index) => {
        let updatedIndicatorObjs = props.indicatorObjs.filter((obj) => obj.index !== index)
        props.setIndicatorObjs(updatedIndicatorObjs);
    }

    const handleIndicatorSelection = (index, newValue) => {
        let newArr = JSON.parse(JSON.stringify(props.indicatorObjs));
        let objToUpdate = newArr.filter((obj) => obj.index === index)[0];
        objToUpdate.indicator = newValue == null ? '' : newValue.indicator;
        objToUpdate.category = '';

        props.setIndicatorObjs(newArr);
    }

    const handleCategorySelection = (index, newValue) => {
        let newArr = JSON.parse(JSON.stringify(props.indicatorObjs));
        let objToUpdate = newArr.filter((obj) => obj.index === index)[0]
        objToUpdate.category = newValue;

        props.setIndicatorObjs(newArr);
    }

    const handleFilterSelection = (index, newValue) => {
        let newArr = JSON.parse(JSON.stringify(props.indicatorObjs));
        let objToUpdate = newArr.filter((obj) => obj.index === index)[0]
        objToUpdate.filters = newValue;

        props.setIndicatorObjs(newArr);
    }

    const renderIndicators = () => {
        if (props.selectedGeographies.length <= 0) {
            return renderEmptyGeographyState();
        } else if (props.indicatorObjs.length <= 0) {
            return renderEmptyIndicatorState();
        } else {
            return renderAddedIndicators();
        }
    }

    const renderAddedIndicators = () => {
        return props.indicatorObjs.map((x) =>
            <Indicator
                key={x.index}
                indicators={props.indicators}
                handleRemove={() => handleRemove(x.index)}
                handleIndicatorSelection={(newValue) => handleIndicatorSelection(x.index, newValue)}
                handleCategorySelection={(newValue) => handleCategorySelection(x.index, newValue)}
                handleFilterSelection={(newValue) => handleFilterSelection(x.index, newValue)}
                indicatorObjs={props.indicatorObjs}
                index={x.index}
            />
        )
    }

    const renderEmptyGeographyState = () => {
        return (
            <div
                className={'indicators-empty-state'}
                style={{marginTop: props.cardHeight / 2 - 8}}
            >
                <span>Indicators can only be selected once a geography is chosen!</span>
            </div>
        )
    }

    const renderEmptyIndicatorState = () => {
        return (
            <div className={'indicators-empty-state margin-top-10'}>
                <div className={'margin-bottom-10'}>{arrowSvg}</div>
                <div>Great! Now select an indicator for your chosen geography!</div>
            </div>
        )
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
                    disabled={props.selectedGeographies.length <= 0}
                    data-testid={'add-indicator'}
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
                    {renderIndicators()}
                </Card>
            </Grid>
        </Grid>
    );
}

export default ComparisonIndicators;
