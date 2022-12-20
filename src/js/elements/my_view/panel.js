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

    return (
        <PanelContainer>
            <MyViewHeader/>
            <ViewSettings
                filteredIndicators={filteredIndicators}
            />
        </PanelContainer>
    );
}

export default Panel;