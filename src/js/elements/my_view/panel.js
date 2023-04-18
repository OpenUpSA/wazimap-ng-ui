import React, {useState, useEffect} from "react";
import MyViewHeader from "./my_view_header";
import ViewSettings from "./view_settings";
import {PanelContainer, LoadingIconContainer} from "./styled_elements";
import CircularProgress from '@mui/material/CircularProgress';

const Panel = (props) => {
    const [filteredIndicators, setFilteredIndicators] = useState([]);
    const [siteWideFilters, setSiteWideFilters] = useState([]);
    const [startedListening, setStartedListening] = useState(false);
    const [siteWideFiltersEnabled] = useState(props.siteWideFiltersEnabled);
    const [profileIndicators, setProfileIndicators] = useState([]);
    const [hiddenIndicators, setHiddenIndicators] = useState(props.controller.hiddenIndicators);
    const [loading, setLoading] = useState(false);

    if (!startedListening) {
        setStartedListening(true);
        props.controller.on('my_view.filteredIndicators.updated', payload => {
            setFilteredIndicators(prev => payload.payload.slice(0));
        });

        props.controller.on('my_view.hiddenIndicatorsPanel.reload', payload => {
            setHiddenIndicators(payload.payload);
        });

        props.controller.on('my_view.siteWideFilters.updated', payload => {
            setSiteWideFilters(prev => payload.payload.siteWideFilters.slice(0));
        })
    }

    useEffect(() => {
        setLoading(true);
        props.api.loadProfileIndicators(props.profileId).then(
            (data) => {
                setLoading(false);
                setProfileIndicators(data);
            }).catch((response) => {
            throw(response);
        })
    }, [props.api, props.profileId, setProfileIndicators, setLoading]);

    const removeFilter = (filteredIndicator, selectedFilter) => {
        props.controller.triggerEvent('my_view.filteredIndicators.removed', {
            filteredIndicator,
            selectedFilter
        });
    }

    const updateHiddenIndicators = (indicatorId, action) => {
        props.controller.triggerEvent('my_view.hiddenIndicators.updated', {
            "indicatorId": indicatorId,
            "action": action
        });
    }

    const removeSiteWideFilter = (swf) => {
        props.controller.removeSiteWideFilter(swf.indicatorValue, swf.subIndicatorValue);
    }

    return (
        <PanelContainer
            className={'narrow-scroll'}
            data-test-id={'my-view-panel'}
        >
            <MyViewHeader/>
            {loading ?
                <LoadingIconContainer>
                    <CircularProgress/>
                </LoadingIconContainer>
                :
                <ViewSettings
                    filteredIndicators={filteredIndicators}
                    siteWideFilters={siteWideFilters}
                    profileIndicators={profileIndicators}
                    removeFilter={(fi, sf) => removeFilter(fi, sf)}
                    hiddenIndicators={hiddenIndicators}
                    updateHiddenIndicators={updateHiddenIndicators}
                    removeSiteWideFilter={(swf) => removeSiteWideFilter(swf)}
                    siteWideFiltersEnabled={siteWideFiltersEnabled}
                />
            }
        </PanelContainer>
    );
}

export default Panel;
