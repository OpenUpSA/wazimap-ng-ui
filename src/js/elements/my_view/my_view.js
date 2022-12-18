import {Component} from "../../utils";
import {createRoot} from "react-dom/client";
import React from "react";
import Toggle from "./toggle";

export class MyView extends Component {
    constructor(parent) {
        super(parent);

        this.addToggle();
    }

    addToggle() {
        let watermarkRoot = createRoot($('.right-panel-toggles .my-view-toggle')[0]);
        watermarkRoot.render(<Toggle/>);
    }
}