import React, {useState} from "react";
import MyViewHeader from "./my_view_header";
import ViewSettings from "./view_settings";
import {PanelContainer} from "./styled_elements";

const Panel = (props) => {
    const [filteredIndicators, setFilteredIndicators] = useState([]);
    const [startedListening, setStartedListening] = useState(false);

    if (!startedListening) {
        props.controller.on('my_view.filteredIndicators.updated', payload => {
            setFilteredIndicators(prev => payload.payload.slice(0));
            setStartedListening(true);
        });
    }

    const removeFilter = (filteredIndicator, selectedFilter) => {
        props.controller.triggerEvent('my_view.filteredIndicators.removed', {
            filteredIndicator,
            selectedFilter
        });
    }

    return (
        <PanelContainer
            className={'narrow-scroll'}
            data-test-id={'my-view-panel'}
        >
            <MyViewHeader/>
            <ViewSettings
                filteredIndicators={filteredIndicators}
                removeFilter={(fi, sf) => removeFilter(fi, sf)}
            />
        </PanelContainer>
    );
}

export default Panel;