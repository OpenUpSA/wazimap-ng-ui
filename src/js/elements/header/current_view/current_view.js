import {Component} from "../../../utils";
import {createRoot} from "react-dom/client";
import ViewSelect from "./view_select";
import React from "react";

export class CurrentView extends Component {
    constructor(parent) {
        super(parent);
    }

    createDropdown(viewsArr) {
        let container = document.createElement('div');
        container.classList.add('current-view-container');
        window.document.getElementsByClassName('nav__content')[0].append(container);

        const root = createRoot(container);
        root.render(
            <ViewSelect
                viewsArr={viewsArr}
            />
        )
    }
}