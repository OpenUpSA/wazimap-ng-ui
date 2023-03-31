import {Component} from "../../utils";
import {createRoot} from "react-dom/client";
import React from "react";
import Toggle from "./toggle";
import Panel from "./panel";

export class MyView extends Component {
    constructor(parent, controller, siteWideFiltersEnabled, api, profileId) {
        super(parent);

        this.siteWideFiltersEnabled = siteWideFiltersEnabled;

        this.addToggle();
        this.addPanel(controller, api, profileId);
    }

    addToggle() {
        let watermarkRoot = createRoot($('.right-panel-toggles .my-view-toggle')[0]);
        watermarkRoot.render(<Toggle/>);
    }

    addPanel(controller, api, profileId) {
        let myViewRoot = createRoot($('.my-view')[0]);
        myViewRoot.render(<Panel
            controller={controller}
            siteWideFiltersEnabled={this.siteWideFiltersEnabled}
            api={api}
            profileId={profileId}
        />)
    }
}
