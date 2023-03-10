import React, {useState, useEffect} from "react";
import MyViewHeader from "./my_view_header";
import ViewSettings from "./view_settings";
import {PanelContainer, LoadingIconContainer} from "./styled_elements";
import CircularProgress from '@mui/material/CircularProgress';

const Panel = (props) => {
    const [filteredIndicators, setFilteredIndicators] = useState([]);
    const [startedListening, setStartedListening] = useState(false);
    const [profileIndicators, setProfileIndicators] = useState([]);
    const [loading, setLoading] = useState(false);

    if (!startedListening) {
        props.controller.on('my_view.filteredIndicators.updated', payload => {
            setFilteredIndicators(prev => payload.payload.slice(0));
            setStartedListening(true);
        });
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
                  profileIndicators={profileIndicators}
                  removeFilter={(fi, sf) => removeFilter(fi, sf)}
                  hiddenIndicators={[]}
                  updateHiddenIndicators={updateHiddenIndicators}
              />
          }
        </PanelContainer>
    );
}

export default Panel;
