import {SubIndicator} from "../dataobjects";
import {Observable} from "../utils";

const allValues = 'All values';

export class SubindicatorFilter extends Observable {
    constructor() {
        super()
        this.indicators = null;
    }

    handleFilter = (_indicators, filterArea, groups, title, _parent, _dropdowns, _defaultFilter) => {
        this.parent = _parent;
        let dropdowns = _dropdowns;
        let indicatorDd = $(dropdowns[0]);
        let subindicatorDd = $(dropdowns[1]);

        this.indicators = _indicators;

        const filtersAvailable = this.checkGroups(groups);
        if (filtersAvailable) {
            this.showFilterArea(filterArea);
        } else {
            this.hideFilterArea(filterArea);
        }
        this.resetDropdowns(dropdowns);
        let callback = (selected) => this.groupSelected(selected, subindicatorDd, title);
        this.populateDropdown(indicatorDd, groups, callback);
        this.handleDefaultFilter(_defaultFilter, indicatorDd, subindicatorDd, title);
    }

    /**
     * this function enables choropleth filters to be remained when user clicks on a child geo
     */
    handleDefaultFilter = (defaultFilter, indicatorDd, subindicatorDd, title) => {
        if (typeof defaultFilter === 'undefined') {
            return;
        }

        const selectedGroup = defaultFilter.group;
        const selectedFilter = defaultFilter.value;

        let groupCallback = (selected) => this.groupSelected(selected, subindicatorDd, title);
        let callback = (selectedFilter) => this.parent.applyFilter(this.getFilteredData(selectedFilter, selectedGroup, title), selectedGroup, selectedFilter);

        this.setOptionSelected(indicatorDd, selectedGroup, groupCallback);
        this.setOptionSelected(subindicatorDd, selectedFilter, callback);
    }

    /**
     * check if the selected subindicator has groups to filter
     */
    checkGroups = (groups) => {
        let hasGroups = true;
        if (groups === null || typeof groups === 'undefined' || groups.length <= 0) {
            hasGroups = false;
        }

        return hasGroups;
    }

    hideFilterArea = (filterArea) => {
        if (!$(filterArea).hasClass('hidden')) {
            $(filterArea).addClass('hidden')
        }
    }

    showFilterArea = (filterArea) => {
        if ($(filterArea).hasClass('hidden')) {
            $(filterArea).removeClass('hidden')
        }
    }

    populateDropdown = (dropdown, itemList, callback) => {
        if ($(dropdown).hasClass('disabled')) {
            $(dropdown).removeClass('disabled')
        }

        let ddWrapper = $(dropdown).find('.dropdown-menu__content');
        let listItem = $(dropdown).find('.dropdown__list_item')[0].cloneNode(true);

        $(ddWrapper).html('');

        itemList = [allValues].concat(itemList);

        itemList.forEach((item, i) => {
            let li = listItem.cloneNode(true);
            if (i !== 0 && $(li).hasClass('selected')) {
                //leave the first item selected in default
                $(li).removeClass('selected')
            }
            $('.truncate', li).text(item);
            $(li).off('click');
            $(li).on('click', () => {
                this.dropdownOptionSelected(dropdown, li, callback);
            })
            $(ddWrapper).append(li);
        })
    }

    dropdownOptionSelected = (dropdown, li, callback) => {
        const selectedClsName = 'selected';
        let selected = $(li).text().trim();
        $(dropdown).find('.dropdown__list_item').each(function () {
            if ($(this).hasClass(selectedClsName)) {
                $(this).removeClass(selectedClsName);
            }

            if ($(this).text() === $(li).text()) {
                $(this).addClass(selectedClsName);
            }
        })

        $(dropdown).find('.dropdown-menu__selected-item .truncate').text(selected);
        $(dropdown).find('.dropdown-menu__content').hide();

        if (callback !== null) {
            callback(selected);
        }
    }

    groupSelected = (selectedGroup, subindicatorDd, title) => {
        let subindicators = [];
        for (const [obj, subindicator] of Object.entries(this.indicators)) {
            if (obj === title) {
                //there can be more than 1 chart for every category, that's why we need this if
                for (const [key, value] of Object.entries(subindicator.groups[selectedGroup])) {
                    subindicators.push(key)
                }
            }
        }

        let callback = (selectedFilter) => this.parent.applyFilter(this.getFilteredData(selectedFilter, selectedGroup, title), selectedGroup, selectedFilter);

        this.populateDropdown(subindicatorDd, subindicators, callback);
    }

    getFilteredData = (selectedFilter, selectedGroup, title) => {
        this.triggerEvent('point_tray.subindicator_filter.filter', {
            indicator: title,
            group: selectedGroup,
            subindicator: selectedFilter
        });

        let chartData = [];

        if (selectedFilter !== allValues) {
            for (const [indicatorTitle, subindicator] of Object.entries(this.indicators)) {
                //filter indicatorTitle
                if (indicatorTitle === title) {
                    for (const [key, value] of Object.entries(subindicator.groups[selectedGroup])) {
                        if (key === selectedFilter) {
                            Object.entries(value).forEach((cd) => {
                                chartData.push(new SubIndicator(cd))
                            })
                        }
                    }
                }
            }
        } else {
            for (const [indicatorTitle, subindicator] of Object.entries(this.indicators)) {
                if (indicatorTitle === title) {
                    chartData = subindicator.subindicators;
                }
            }
        }

        return chartData;
    }

    resetDropdowns = (dropdowns) => {
        let self = this;
        for (let i = 0; i < dropdowns.length; i++) {
            const dropdown = dropdowns[i];
            self.setOptionSelected(dropdown, allValues, null);
        }
    }

    setOptionSelected = (dropdown, value, callback) => {
        let self = this;

        $(dropdown).find('.dropdown__list_item').each(function () {
            const li = $(this);
            if (li.text().trim() === value) {
                self.dropdownOptionSelected(dropdown, li, callback);
            }
        })
    }
}