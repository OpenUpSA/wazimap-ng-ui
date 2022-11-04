import React, {useState} from "react";
import {Grid} from "@mui/material";
import {API} from "../api";

//components
import Geographies from "./geographies";
import Result from "./result";
import ComparisonIndicators from "./comparison-indicators";

const Body = (props) => {
    const [selectedGeographies, setSelectedGeographies] = useState([]);

    const api = new API('https://staging.wazimap-ng.openup.org.za');
    const profileId = 8;

    const calculateCardHeight = () => {
        const topSpace = 56 + 60;
        const bottomSpace = 40;
        const buttonSpace = 172;
        return (window.innerHeight - topSpace - bottomSpace - buttonSpace) / 2;
    }

    return (
        <Grid container className={'page-content'}>
            <Grid container>
                <Grid container>
                    <Grid xs={5}
                          item={true}
                          container
                          justifyContent={'center'}
                          className={'body-grid'}
                    >
                        <Grid className={'full-width has-bottom-border padding-bottom-25'}>
                            <Geographies
                                cardHeight={calculateCardHeight()}
                                api={api}
                                profileId={profileId}
                                selectedGeographies={selectedGeographies}
                                setSelectedGeographies={setSelectedGeographies}
                            />
                        </Grid>
                        <Grid
                            className={'margin-top-25 full-width'}
                        >
                            <ComparisonIndicators
                                cardHeight={calculateCardHeight()}
                            />
                        </Grid>
                    </Grid>
                    <Grid xs={7}
                          item={true}
                          container
                          justifyContent={'center'}
                          className={'body-grid has-left-border'}
                    >
                        <Grid className={'full-width'}>
                            <Result
                                selectedGeographies={selectedGeographies}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default Body;