import {Component} from "../../utils";
import {createRoot} from "react-dom/client";
import React from "react";
import Toggle from "./toggle";
import Panel from "./panel";

export class MyView extends Component {
    constructor(parent, controller, siteWideFiltersEnabled, api, profileId) {
        super(parent);

        this.siteWideFiltersEnabled = siteWideFiltersEnabled;
        this.toggleElement = $('.right-panel-toggles .my-view-toggle')[0];
        this.toggleRoot = createRoot(this.toggleElement);

        this.addToggle();
        this.addPanel(controller, api, profileId);
    }

    addToggle() {
        this.toggleRoot.render(<Toggle
            allFiltersAreAvailable={true}
        />);
    }

    setFilterAvailability(val) {
        this.toggleRoot.render(<Toggle
            allFiltersAreAvailable={val}
        />);
    }

    addPanel(controller, api, profileId) {
        let myViewRoot = createRoot($('.my-view')[0]);
        myViewRoot.render(<Panel
            controller={controller}
            siteWideFiltersEnabled={this.siteWideFiltersEnabled}
            api={api}
            profileId={profileId}
            setFilterAvailability={(value) => this.setFilterAvailability(value)}
        />)
    }
}
