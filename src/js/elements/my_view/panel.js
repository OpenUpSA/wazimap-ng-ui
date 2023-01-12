import React, {useState, useEffect} from "react";
import MyViewHeader from "./my_view_header";
import ViewSettings from "./view_settings";
import ViewList from "./view_list";
import {PanelContainer, LoadingIconContainer} from "./styled_elements";
import {isEmpty} from "lodash";
import CircularProgress from '@mui/material/CircularProgress';

const Panel = (props) => {
    const [filteredIndicators, setFilteredIndicators] = useState([]);
    const [startedListening, setStartedListening] = useState(false);
    const [profileViews, setProfileViews] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      if(isEmpty(props.controller.profileViews)){
        setLoading(true);
      } else {
        setLoading(False);

      }
    }, [props.controller]);

    if (!startedListening) {
        props.controller.on('my_view.filteredIndicators.updated', payload => {
            setFilteredIndicators(prev => payload.payload.slice(0));
            setStartedListening(true);
        });

        props.controller.on('my_view.profileViews.updated', payload => {
            setProfileViews(payload.payload);
            setStartedListening(true);
            setLoading(false);
        });
    }

    const removeFilter = (filteredIndicator, selectedFilter) => {
        props.controller.triggerEvent('my_view.filteredIndicators.removed', {
            filteredIndicator,
            selectedFilter
        });
    }

    console.log(profileViews);
    console.log("Render my viw");
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
              :<>
                <ViewList
                  profileViews={profileViews}
                />
                <ViewSettings
                  filteredIndicators={filteredIndicators}
                  removeFilter={(fi, sf) => removeFilter(fi, sf)}
                />
              </>
          }
        </PanelContainer>
    );
}

export default Panel;
