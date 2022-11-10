import React, {useState, useEffect} from "react";
import {Button, Card, Chip, Grid} from "@mui/material";
import AddIcon from '@mui/icons-material/AddCircle';

//components
import SectionTitle from "./section-title";
import Indicator from "./indicator";

const ComparisonIndicators = (props) => {
    const [previousSelectedGeographies, setPreviousSelectedGeographies] = useState([]);
    const arrowSvg =
        <svg width="68" height="147" viewBox="0 0 68 147" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M58.9715 0.118419C58.4845 -0.141979 57.8785 0.0417527 57.6181 0.528796L53.3747 8.46562C53.1143
            8.95267 53.298 9.55859 53.7851 9.81899C54.2721 10.0794 54.878 9.89565 55.1384 9.40861L58.9104 2.35365L65.9654
            6.1256C66.4524 6.38599 67.0583 6.20226 67.3187 5.71522C67.5791 5.22818 67.3954 4.62225 66.9083 4.36186L58.9715
            0.118419ZM5.90373 145.572C3.16222 139.784 2.29581 134.458 2.79782 129.41C3.30085 124.351 5.18405 119.511
            8.03179 114.714C13.7576 105.068 23.2348 95.8083 32.8583 85.43C42.4299 75.1077 52.0678 63.7485 57.8127
            50.0589C63.5739 36.3306 65.4002 20.31 59.457 0.710109L57.543 1.29047C63.3498 20.4403 61.5512 35.9821
            55.9685 49.285C50.3697 62.6266 40.9451 73.7675 31.3917 84.0701C21.8902 94.3169 12.1799 103.808 6.31197
            113.693C3.36283 118.661 1.34759 123.782 0.807639 129.212C0.266685 134.652 1.21276 140.341 4.09625 146.428L5.90373 145.572Z"
                  fill="#39AD84"/>
        </svg>


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
        let objToUpdate = newArr.filter((obj) => obj.index === index)[0];
        objToUpdate.indicator = newValue.indicator;

        props.setIndicatorObjs(newArr);
    }

    const handleCategorySelection = (index, newValue) => {
        let newArr = JSON.parse(JSON.stringify(props.indicatorObjs));
        let objToUpdate = newArr.filter((obj) => obj.index === index)[0]
        objToUpdate.category = newValue;

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