import React, {useState} from "react";
import MyViewHeader from "./my_view_header";
import ViewSettings from "./view_settings";
import {PanelContainer} from "./styled_elements";

const Panel = (props) => {
    const [filteredIndicators, setFilteredIndicators] = useState([]);
    const [siteWideFilters, setSiteWideFilters] = useState([]);
    const [startedListening, setStartedListening] = useState(false);

    if (!startedListening) {
        setStartedListening(true);
        props.controller.on('my_view.filteredIndicators.updated', payload => {
            setFilteredIndicators(prev => payload.payload.slice(0));
        });

        props.controller.on('my_view.siteWideFilters.updated', payload => {
            setSiteWideFilters(prev => payload.payload.siteWideFilters.slice(0));
        })
    }

    const removeFilter = (filteredIndicator, selectedFilter) => {
        props.controller.triggerEvent('my_view.filteredIndicators.removed', {
            filteredIndicator,
            selectedFilter
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
            <ViewSettings
                filteredIndicators={filteredIndicators}
                siteWideFilters={siteWideFilters}
                removeFilter={(fi, sf) => removeFilter(fi, sf)}
                removeSiteWideFilter={(swf) => removeSiteWideFilter(swf)}
            />
        </PanelContainer>
    );
}

export default Panel;