const allValues = 'All values';

export class SubindicatorFilter {
    constructor() {

    }

    handleFilter = (indicators, groups, title, _parent) => {
        this.parent = _parent;
        let dropdowns = $(this.parent.subCategoryNode).find('.filter__dropdown_wrap');
        let indicatorDd = $(dropdowns[0]);
        let subindicatorDd = $(dropdowns[1]);

        let callback = (selected) => this.groupSelected(selected, indicators, subindicatorDd, title);
        this.populateDropdown(indicatorDd, groups, callback);
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

        callback(selected);
    }

    groupSelected = (selectedGroup, indicators, subindicatorDd, title) => {
        let subindicators = [];
        for (const [obj, subindicator] of Object.entries(indicators)) {
            if (obj === title) {
                //there can be more than 1 chart for every category, that's why we need this if
                for (const [key, value] of Object.entries(subindicator.groups[selectedGroup])) {
                    subindicators.push(key)
                }
            }
        }

        let callback = (selectedFilter) => this.parent.applyFilter(this.getFilteredData(selectedFilter, indicators, selectedGroup));

        this.populateDropdown(subindicatorDd, subindicators, callback);
    }

    getFilteredData = (selectedFilter, indicators, selectedGroup) => {
        let chartData = null;
        if (selectedFilter !== allValues) {
            for (const [obj, subindicator] of Object.entries(indicators)) {
                for (const [key, value] of Object.entries(subindicator.groups[selectedGroup])) {
                    if (key === selectedFilter) {
                        chartData = value;
                    }
                }
            }

            let labelColumn = this.getLabelColumnName(chartData);
            this.parent.attrOptions = {valueColumn: 'count', labelColumn: labelColumn};
        } else {
            for (const [obj, subindicator] of Object.entries(indicators)) {
                chartData = subindicator.subindicators;
            }

            this.parent.attrOptions = {labelColumn: 'label', valueColumn: 'value'};
        }

        return chartData;
    }

    getLabelColumnName = (chartData) => {
        //this function returns the key to get the labels from i.e age group, gender..
        let dkey = '';

        if (typeof chartData[0] !== 'undefined' && chartData[0] !== null) {
            Object.keys(chartData[0]).forEach(function eachKey(key) {
                if (key !== 'count') {
                    dkey = key;
                }
            });
        }

        return dkey;
    }
}