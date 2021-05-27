import {SubIndicator} from "../dataobjects";
import {Observable} from "../utils";

const ALLVALUES = 'All values';

export class SubindicatorFilter extends Observable {
    constructor(filterArea, groups, title, filterCallback, _dropdowns, _defaultFilter, childData) {
        super()
        this.childData = childData;
        this.filterCallback = filterCallback;
        this.title = title;
        this.selectedFilters = [];
        this.groups = groups;
        let dropdowns = _dropdowns;
        let dds = [];
        for (let i = 0; i < dropdowns.length / 2; i++) {
            let item = {};
            item['indicatorDd'] = $(dropdowns[i * 2]);
            item['subindicatorDd'] = $(dropdowns[(i * 2) + 1]);
            dds.push(item);
        }
        this.allDropdowns = dropdowns;

        const filtersAvailable = this.checkGroups(groups);
        if (filtersAvailable) {
            this.showFilterArea(filterArea);
        } else {
            this.hideFilterArea(filterArea);
        }
        this.resetDropdowns(dropdowns);
        dds.forEach((dd) => {
            let subindicatorDd = dd['subindicatorDd'];
            let indicatorDd = dd['indicatorDd'];
            this.setDropdownEvents(indicatorDd, subindicatorDd);
        })
        //this.handleDefaultFilter(_defaultFilter, indicatorDd, subindicatorDd, title);
    }

    setDropdownEvents = (indicatorDd, subindicatorDd) => {
        let callback = (selected) => this.groupSelected(selected, subindicatorDd, this.title);
        this.populateDropdown(indicatorDd, this.groups, callback);
    }

    handleFilter = (filter) => {
        this.filterCallback(this.getFilteredData(filter), this.selectedGroup, filter);
    }

    /**
     *    *      * this function enables choropleth filters to be remained when user clicks on a child geo
     *       *           */
    handleDefaultFilter = (defaultFilter, indicatorDd, subindicatorDd, title) => {
        if (typeof defaultFilter === 'undefined') {
            return;
        }

        this.selectedGroup = defaultFilter.group;
        const selectedFilter = defaultFilter.value;

        let groupCallback = (selected) => this.groupSelected(selected, subindicatorDd, title);

        this.setOptionSelected(indicatorDd, this.selectedGroup, groupCallback);
        this.setOptionSelected(subindicatorDd, selectedFilter, this.handleFilter);

    }

    /**
     *    *      * check if the selected subindicator has groups to filter
     *       *           */
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

    resetDropdown = (dropdown) => {
        $(dropdown).addClass('disabled')

        $(dropdown).find('.dropdown-menu__selected-item .truncate').text(ALLVALUES);
        let ddWrapper = $(dropdown).find('.dropdown-menu__content');
        let listItem = $(dropdown).find('.dropdown__list_item')[0].cloneNode(true);
        $(ddWrapper).html('');
        let li = listItem.cloneNode(true);
        $(li).removeClass('selected')
        $('.truncate', li).text(ALLVALUES);
        $(li).off('click');
        $(ddWrapper).append(li);

    }
    populateDropdown = (dropdown, itemList, callback) => {
        if ($(dropdown).hasClass('disabled')) {
            $(dropdown).removeClass('disabled')
        }

        let ddWrapper = $(dropdown).find('.dropdown-menu__content');
        let listItem = $(dropdown).find('.dropdown__list_item')[0].cloneNode(true);

        $(ddWrapper).html('');

        itemList = [ALLVALUES].concat(itemList);

        itemList.forEach((item, i) => {
            if (item !== null) {
                let li = listItem.cloneNode(true);
                if (i !== 0 && $(li).hasClass('selected')) {
                    //leave the first item selected in default
                    $(li).removeClass('selected');
                }
                if (typeof item.name === 'undefined') {
                    $('.truncate', li).text(item);

                } else {
                    $('.truncate', li).text(item.name);

                }

                $(li).off('click');
                $(li).on('click', () => {
                    this.dropdownOptionSelected(dropdown, li, item, callback);
                })
                $(ddWrapper).append(li);
            }
        })
    }

    dropdownOptionSelected = (dropdown, li, item, callback) => {
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

        if (callback !== null && item !== null) {
            callback(item);
        }
    }

    groupSelected = (selectedGroup, subindicatorDd, title) => {
        this.selectedGroup = selectedGroup;
        this.resetDropdown(subindicatorDd);
        this.handleFilter(ALLVALUES);
        if (selectedGroup !== ALLVALUES) {
            let subindicators = selectedGroup.subindicators;
            this.populateDropdown(subindicatorDd, subindicators, this.handleFilter);
        }
    }

    getFilteredData = (selectedFilter) => {
        if (selectedFilter !== null){
            this.triggerEvent('point_tray.subindicator_filter.filter', {
                indicator: this.title,
                group: this.selectedGroup,
                subindicator: selectedFilter
            });
        }

        return this.getFilteredGroups()
    }

    getFilteredGroups() {
        let filteredData = {};
        this.selectedFilters = [];

        let filterCount = this.allDropdowns.length / 2;
        for (let i = 0; i < filterCount; i++) {
            let filter = {};
            let key = $(this.allDropdowns[i * 2]).find('.dropdown-menu__selected-item .truncate').text();
            let value = $(this.allDropdowns[(i * 2) + 1]).find('.dropdown-menu__selected-item .truncate').text();
            filter[key] = value;
            if (value !== ALLVALUES) {
                this.selectedFilters.push(filter)
            }
        }

        Object.entries(this.childData).map(([code, data]) => {
            filteredData[code] = data.filter((cd) => {
                let isFiltered = true;
                this.selectedFilters.forEach((f) => {
                    for (let key in f) {
                        if (cd[key] !== f[key]) {
                            isFiltered = false;
                        }
                    }
                })

                return isFiltered;
            })
        })

        return filteredData;
    }

    resetDropdowns = (dropdowns) => {
        console.log({dropdowns})
        let self = this;
        for (let i = 0; i < dropdowns.length; i++) {
            const dropdown = dropdowns[i];
            self.setOptionSelected(dropdown, ALLVALUES, null);
        }
    }

    setOptionSelected = (dropdown, value, callback) => {
        let self = this;

        $(dropdown).find('.dropdown__list_item').each(function () {
            const li = $(this);
            if (li.text().trim() === value) {
                self.dropdownOptionSelected(dropdown, li, null, callback);
            }
        })
    }
}
