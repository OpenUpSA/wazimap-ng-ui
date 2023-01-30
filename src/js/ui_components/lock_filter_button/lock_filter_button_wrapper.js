import {Component} from "../../utils";
import {createRoot} from "react-dom/client";
import LockButton from "./lock_button";
import React from "react";

export class LockFilterButtonWrapper extends Component {
    constructor(parent) {
        super(parent);

        this.prepareDomElements();
    }

    prepareDomElements() {
        this.createButton();
    }

    createButton() {
        let wrapper = document.createElement('div');
        $(wrapper).addClass('lock-filter-button-wrapper');
        $(wrapper).insertBefore($(this.parent.container).find(this.parent._elements.removeFilterButton));

        let root = createRoot(wrapper);
        root.render(
            <LockButton
                filterRow={this.parent}
            />
        )
    }
}