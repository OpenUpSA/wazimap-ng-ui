import {SubIndicator} from "../dataobjects";
import {Observable} from "../utils";

const ALLVALUES = 'All values';

export class SubindicatorFilter extends Observable {
    constructor(filterArea, groups, title, _parent, _dropdowns, _defaultFilter, childData) {
        super()
        this.parent = _parent;
        this.childData = childData;
        let dropdowns = _dropdowns;
        let indicatorDd = $(dropdowns[0]);
        let subindicatorDd = $(dropdowns[1]);

        const filtersAvailable = this.checkGroups(groups);
        if (filtersAvailable) {
            this.showFilterArea(filterArea);
        } else {
            this.hideFilterArea(filterArea);
        }

        this.resetDropdowns(dropdowns);
        let callback = (selected) => this.groupSelected(selected, subindicatorDd, title);
        this.populateDropdown(indicatorDd, groups, callback);
        this.handleDefaultFilter(_defaultFilter, indicatorDd, subindicatorDd, title, groups);
    }

    /**
     * this function enables choropleth filters to be remained when user clicks on a child geo
     */
    handleDefaultFilter = (defaultFilter, indicatorDd, subindicatorDd, title, groups) => {
        if (typeof defaultFilter === 'undefined') {
            return;
        }

        const selectedGroup = groups.filter((g) => {
            return g.name === defaultFilter.group
        })[0];
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

        console.log({itemList})

        itemList.forEach((item, i) => {
            if (item !== null) {
                let li = listItem.cloneNode(true);
                if (i !== 0 && $(li).hasClass('selected')) {
                    //leave the first item selected in default
                    $(li).removeClass('selected')
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
        let callback = (selectedFilter) => this.parent.applyFilter(this.getFilteredData(selectedFilter, selectedGroup, title), selectedGroup, selectedFilter);
        this.resetDropdown(subindicatorDd);
        callback(ALLVALUES);
        if (selectedGroup !== ALLVALUES) {
            let subindicators = selectedGroup.subindicators;
            this.populateDropdown(subindicatorDd, subindicators, callback);
        }
    }

    getFilteredData = (selectedFilter, selectedGroup, title) => {
        this.triggerEvent('point_tray.subindicator_filter.filter', {
            indicator: title,
            group: selectedGroup,
            subindicator: selectedFilter
        });

        if (selectedFilter !== ALLVALUES)
            return this.getFilteredGroups(selectedGroup, selectedFilter)
        else
            return this.childData;
    }

    getFilteredGroups(selectedGroup, selectedFilter) {
        let filteredData = {};

        Object.entries(this.childData).map(([code, data]) => {
            filteredData[code] = data.filter((cd) => {
                return cd[selectedGroup.name] === selectedFilter
            })
        })

        return filteredData;
    }

    getFilteredSubindicators(subindicators) {
        return subindicators.map(el => {
            return new SubIndicator([el.label, el])
        })
    }

    resetDropdowns = (dropdowns) => {
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
            if ((typeof value.name !== 'undefined' && li.text().trim() === value.name) || li.text().trim() === value) {
                self.dropdownOptionSelected(dropdown, li, value, callback);
            }
        })
    }
}
