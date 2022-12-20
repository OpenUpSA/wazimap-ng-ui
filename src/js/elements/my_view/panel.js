import React, {useState} from "react";
import MyViewHeader from "./my_view_header";
import ViewSettings from "./view_settings";
import {PanelContainer} from "./styled_elements";

const Panel = (props) => {
    const [filteredIndicators, setFilteredIndicators] = useState([]);

    props.controller.on('my_view.filteredIndicators.updated', payload => {
        setFilteredIndicators(payload.payload);
    });

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