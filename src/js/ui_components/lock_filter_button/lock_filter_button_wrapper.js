import {Component} from "../../utils";
import {createRoot} from "react-dom/client";
import LockButton from "./lock_button";
import {GlobalLoading} from '../global_loading'

import React from "react";

export class LockFilterButtonWrapper extends Component {
    constructor(parent) {
        super(parent);

        this.globalLoading = new GlobalLoading(this, 'Applying site-wide filter');
        this.prepareDomElements();
        this.prepareUIEvents();
    }

    prepareDomElements() {
        this.createButton();
    }

    prepareUIEvents() {
        this.parent.on('filterRow.filter.locked', () => {
            this.globalLoading.message = 'Applying site-wide filter';
            this.globalLoading.isVisible = true;
        })

        this.parent.on('filterRow.filter.unlocked', () => {
            this.globalLoading.message = 'Removing site-wide filter';
            this.globalLoading.isVisible = true;
        })

        this.parent.parent.on('filterRow.all.updated', () => {
            this.globalLoading.isVisible = false;
        })
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