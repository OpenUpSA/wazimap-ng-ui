import {SubIndicator} from "../dataobjects";
import {Observable} from "../utils";

const DROPDOWN_MESSAGES = ['Select an attribute', 'Select a value'];
const ALLVALUES = 'All values';

export class SubindicatorFilter extends Observable {
    constructor(filterArea, groups, title, filterCallback, _dropdowns, _defaultFilters, childData) {
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
        this.handleDefaultFilter(_defaultFilters, dds);
    }

    setDropdownEvents = (indicatorDd, subindicatorDd) => {
        let callback = (selected) => this.groupSelected(selected, subindicatorDd, DROPDOWN_MESSAGES[1]);
        this.populateDropdown(indicatorDd, this.groups, callback);

        $(indicatorDd).find('.dropdown-menu__trigger').on('click', () => {
            this.disableSelectedOptions(indicatorDd);
        })
    }

    handleFilter = (filter) => {
        let filterArr = [];
        let filteredData = this.getFilteredData(filter);

        this.selectedFilters.forEach((sf) => {
            for (const [group, value] of Object.entries(sf)) {
                filterArr.push({
                    group: group,
                    value: value
                })
            }
        })
        this.filterCallback(filteredData, filterArr);
    }

    /**
     *    *      * this function enables choropleth filters to be remained when user clicks on a child geo
     *       *           */
    handleDefaultFilter = (defaultFilters, dds) => {
        if (typeof defaultFilters === 'undefined' || defaultFilters.length <= 0) {
            return;
        }

        dds.forEach((dropdowns, index) => {
            this.selectedGroup = defaultFilters[index].group;
            const selectedFilter = defaultFilters[index].value;

            let indicatorDd = dropdowns['indicatorDd'];
            let subindicatorDd = dropdowns['subindicatorDd'];

            let groupCallback = (selected) => this.groupSelected(selected, subindicatorDd, DROPDOWN_MESSAGES[1]);

            this.setOptionSelected(indicatorDd, this.selectedGroup, groupCallback);
            this.setOptionSelected(subindicatorDd, selectedFilter, this.handleFilter);

            if (defaultFilters[index].default) {
                $(indicatorDd).addClass('disabled')
            }
        })
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

    resetDropdown = (dropdown, text) => {
        $(dropdown).addClass('disabled')

        $(dropdown).find('.dropdown-menu__selected-item .truncate').text(text);
        let ddWrapper = $(dropdown).find('.dropdown-menu__content');
        let listItem = $(dropdown).find('.dropdown__list_item')[0].cloneNode(true);
        $(ddWrapper).html('');
        let li = listItem.cloneNode(true);
        $(li).removeClass('selected')
        $('.truncate', li).text(text);
        $(li).off('click');
        $(ddWrapper).append(li);

    }

    populateDropdown = (dropdown, itemList, callback) => {
        if ($(dropdown).hasClass('disabled')) {
            $(dropdown).removeClass('disabled')
        }

        if ($(dropdown).hasClass('is--disabled')) {
            $(dropdown).removeClass('is--disabled')
        }

        let ddWrapper = $(dropdown).find('.dropdown-menu__content');
        let listItem = $(dropdown).find('.dropdown__list_item')[0].cloneNode(true);

        $(ddWrapper).html('');

        if ($(dropdown).closest('.map-options__filter-row').attr('data-isextra') !== 'true') {
            itemList = [ALLVALUES].concat(itemList);
        }

        itemList.forEach((item, i) => {
            if (item !== null) {
                let li = listItem.cloneNode(true);

                $(li).removeClass('selected');

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

    groupSelected = (selectedGroup, subindicatorDd, text) => {
        let name = typeof selectedGroup.name === 'undefined' ? selectedGroup : selectedGroup.name
        this.selectedGroup = this.groups.filter((g) => {
            return g.name === name
        })[0];
        this.resetDropdown(subindicatorDd, text);
        this.handleFilter(text);
        if (selectedGroup !== text && selectedGroup !== ALLVALUES) {
            let subindicators = this.selectedGroup.subindicators;
            this.populateDropdown(subindicatorDd, subindicators, this.handleFilter);
        }
    }

    getFilteredData = (selectedFilter) => {
        if (selectedFilter !== null) {
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
            if (value !== DROPDOWN_MESSAGES[1] && value !== ALLVALUES) {
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
        let self = this;
        for (let i = 0; i < dropdowns.length; i++) {
            const dropdown = dropdowns[i];
            self.setOptionSelected(dropdown, DROPDOWN_MESSAGES[i], null);
        }
    }

    setOptionSelected = (dropdown, value, callback) => {
        let self = this;
        let deselect = true;

        $(dropdown).find('.dropdown__list_item').each(function () {
            const li = $(this);
            if (li.text().trim() === value) {
                self.dropdownOptionSelected(dropdown, li, value, callback);
                deselect = false;
            }
        });


        $(dropdown).find(".dropdown-menu__trigger .dropdown-menu__selected-item .truncate").text(value);
    }

    disableSelectedOptions = (dropdown) => {
        let self = this;
        $(dropdown).find('.dropdown__list_item').each(function () {
            const li = $(this);
            let disableOption = false;
            self.selectedFilters.forEach((sf) => {
                for (const [group, value] of Object.entries(sf)) {
                    if (li.text().trim() === group) {
                        disableOption = true;
                    }
                }
            })

            if (disableOption) {
                $(li).addClass('disabled');
            } else {
                $(li).removeClass('disabled');
            }
        });
    }
}