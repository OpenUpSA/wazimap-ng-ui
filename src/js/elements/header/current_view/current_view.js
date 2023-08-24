import {Component} from "../../../utils";
import {createRoot} from "react-dom/client";
import ViewSelect from "./view_select";
import React from "react";

export class CurrentView extends Component {
    constructor(parent) {
        super(parent);
    }

    checkAndCreateDropdown(viewsArr, currentViewData) {
        console.log({currentViewData})
        let dropdownExists = document.getElementsByClassName('current-view-container').length > 0;

        if (!dropdownExists) {
            this.createDropdown(viewsArr, currentViewData);
        }
    }

    createDropdown(viewsArr, currentViewData) {
        let container = document.createElement('div');
        container.classList.add('current-view-container');
        window.document.getElementsByClassName('nav__content')[0].append(container);

        const root = createRoot(container);
        root.render(
            <ViewSelect
                viewsArr={viewsArr}
                viewData={currentViewData}
            />
        )
    }
}