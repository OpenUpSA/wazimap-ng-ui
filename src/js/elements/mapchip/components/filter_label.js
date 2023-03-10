import {Component} from "../../../utils";
import React from 'react';
import SnackbarContent from './snackbar_content';
import toast from "../../../ui_components/snackbar/snackbar";


export class FilterLabel extends Component {
    constructor(parent) {
        super(parent);

        this._tooltip = parent._tooltip;
        this._filterHeaderTitleContainer = parent._filterHeaderTitleContainer;
        this._isContentVisible = !parent.isContentVisible;
        this.prepareDomElements();
    }

    get isContentVisible() {
        return this._isContentVisible;
    }

    set isContentVisible(value) {
        this._isContentVisible = value;
        this.setFilterLabelContainerVisibility(value);
    }

    getFilterLabelHTML() {
        let html = "<div class='filters__header_label' title='Show Applied Filters'>";
        html += "<span id='selected_filter_count'>0</span>";
        html += " of ";
        html += "<span id='total_filter_count'></span>";
        html += " filters applied";
        html += "</div>";
        return html;
    }

    prepareDomElements() {
        const filterLabelHTML = this.getFilterLabelHTML();
        this._filterHeaderTitleContainer.append(filterLabelHTML);
        this._filterHeaderLabelContainer = this._filterHeaderTitleContainer.find(".filters__header_label");
        this._selectedFilterCountContainer = this._filterHeaderLabelContainer.find("#selected_filter_count");
        this._totalFilterCountContainer = this._filterHeaderLabelContainer.find("#total_filter_count");
        this._tooltip.enableTooltip(this._filterHeaderLabelContainer);
    }

    setFilterLabelTotalCount(groups) {
        const totalGroupLength = groups.length - 1;
        this._totalFilterCountContainer.html(totalGroupLength);
    }

    setFilterLabelSelectedCount(selectedFilter) {
        const selectedFilterLength = Object.keys(selectedFilter).length;
        this._selectedFilterCountContainer.html(selectedFilterLength);
    }

    setFilterLabelContainerVisibility(isVisible = this.isContentVisible) {
        if (isVisible) {
            $(this._filterHeaderLabelContainer).removeClass('hidden');
        } else {
            $(this._filterHeaderLabelContainer).addClass('hidden');
            this.hideNotificationBadge();
        }
    }

    showNotificationBadge() {
        this._filterHeaderLabelContainer.addClass("notification-badges");
    }

    showSnackbar() {
        let config = {
            autoHideDuration: 3000,
            anchorOrigin: {
                horizontal: "center",
                vertical: "bottom"
            },
            sx: {
                "& .SnackbarContent-root": {
                    color: "black",
                    backgroundColor: "white",
                    minWidth: "auto !important",
                    padding: "3px 10px 3px 10px"
                }
            },
            rootcomponentclass: "snackbar-position"
        }
        let el = document.getElementById("mapchip-snackbar");
        toast.default(<SnackbarContent/>, config, el);
    }

    hideNotificationBadge() {
        this._filterHeaderLabelContainer.removeClass("notification-badges");
    }

    compareFilters(previouslySelectedFilters, oldFilters, siteWideFilters) {
        let newFiltersClone = this.tidyFilterArray(previouslySelectedFilters, siteWideFilters);
        let oldFiltersClone = this.tidyFilterArray((oldFilters[0]?.filters || []), siteWideFilters);

        const isEqual = this.isEqualsJson(newFiltersClone, oldFiltersClone);
        if (!isEqual) {
            this.showNotificationBadge();
            this.showSnackbar();
            if (previouslySelectedFilters.length === 0) {
                this.parent.appliedFilters = [];
            }
        }
    }

    tidyFilterArray(arrToClone, siteWideFilters) {
        const keyArray = ['group', 'value'];

        let arr = structuredClone(arrToClone);
        arr.forEach(f => {
            f.isSiteWideFilter = siteWideFilters.filter(x => x.indicatorValue === f.group && x.subIndicatorValue === f.value)[0] != null;
        })
        arr = arr.filter(x => !x.isSiteWideFilter);
        arr.forEach(function (x) {
            Object.keys(x).forEach(key => {
                if (keyArray.indexOf(key) < 0) {
                    delete x[key];
                }
            })
        });

        return arr;
    }

    isEqualsJson(obj1, obj2) {
        return JSON.stringify(obj1) === JSON.stringify(obj2);
    }
}
