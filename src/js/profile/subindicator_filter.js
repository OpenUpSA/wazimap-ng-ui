import {SubIndicator} from "../dataobjects";
import {Observable} from "../utils";

const ALLVALUES = 'All values';

export class SubindicatorFilter extends Observable {
    constructor(indicators, filterArea, groups, title, _parent, _dropdowns, _defaultFilter) {
        super()
        this.indicators = indicators;
        this.parent = _parent;
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
        let callback = (selectedFilter) => this.parent.applyFilter(this.getFilteredData(selectedFilter, selectedGroup, title), selectedGroup, selectedFilter);
        this.resetDropdown(subindicatorDd);
        callback(ALLVALUES);
        if (selectedGroup !== ALLVALUES) {
          let subindicators = Object.keys(this.indicators[title].groups[selectedGroup]);
          this.populateDropdown(subindicatorDd, subindicators, callback);
        }
    }

    getFilteredGroups(groups, selectedGroup, selectedFilter) {
        const group = groups[selectedGroup]
        if (group == undefined)
            return []

        const groupValue = Object.entries(group).find(g => g[0] == selectedFilter)
        if (groupValue == undefined)
            return []

        const subindicators = Object.entries(groupValue[1])
        return subindicators.map(cd => new SubIndicator(cd))
    }

    getFilteredSubindicators(subindicators) {
        return subindicators.map(el => {
            return new SubIndicator([el.label, el])
        })
    }

    getFilteredGroups(groups, selectedGroup, selectedFilter) {
        const group = groups[selectedGroup]
        if (group == undefined)
            return []

        const groupValue = Object.entries(group).find(g => g[0] == selectedFilter)
        if (groupValue == undefined)
            return []

        const subindicators = Object.entries(groupValue[1])
        return subindicators.map(cd => new SubIndicator(cd))
    }

    getFilteredSubindicators(subindicators) {
        return subindicators.map(el => {
            return new SubIndicator([el.label, el])
        })
    }

    getFilteredData = (selectedFilter, selectedGroup, title) => {
        this.triggerEvent('point_tray.subindicator_filter.filter', {
            indicator: title,
            group: selectedGroup,
            subindicator: selectedFilter
        });

        const subindicatorData = this.indicators[title]

        if (subindicatorData == undefined)
            return []

        if (selectedFilter !== ALLVALUES)
            return this.getFilteredGroups(subindicatorData.groups, selectedGroup, selectedFilter)
        else
            return this.getFilteredSubindicators(subindicatorData.subindicators)
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
            if (li.text().trim() === value) {
                self.dropdownOptionSelected(dropdown, li, callback);
            }
        })
    }
}
