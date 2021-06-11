import { Observable } from "../../utils";
import DropdownMenu from "../dropdown_menu";
import { AddFilterButton } from "./add_filter_button";

const filterRowClass = '.map-options__filter-row';

export class FilterController extends Observable {
    constructor() {
        super();

        this.addFilterButton = new AddFilterButton();
        this.filter = null;
        this.groups = null;

        this.prepareEvents();
    }

    setAddFilterButton() {
        const maxDropDowns = this.groups.length * 2
        const numDropDowns = this.filter.allDropdowns.length;

        if (numDropDowns >= maxDropDowns) {
            this.addFilterButton.disable();
        } else {
            this.addFilterButton.enable();
        }
    }

    prepareEvents() {
        const self = this;
        this.addFilterButton.on('mapchip.filters.addButton.clicked', () => {
            self.addFilter()
        })
    }

    addFilter(isDefault = false) {
        let filterRow = $(filterRowClass)[0].cloneNode(true);

        let indicatorDd = $(filterRow).find('.mapping-options__filter')[0];
        let subindicatorDd = $(filterRow).find('.mapping-options__filter')[1];

        $(filterRow).attr('data-isextra', true);
        if (!isDefault) {
            this.setRemoveFilter(filterRow, indicatorDd, subindicatorDd);
        }
        $(filterRow).insertBefore($('a.mapping-options__add-filter'));

        const dropdownMenu = new DropdownMenu($(filterRow));
        if (this.filter !== null) {
            this.filter.allDropdowns.push(indicatorDd);
            this.filter.allDropdowns.push(subindicatorDd);
            this.filter.setDropdownEvents(indicatorDd, subindicatorDd);

            this.setAddFilterButton();
        }
    }
    
    setRemoveFilter(filterRow, indicatorDd, subindicatorDd) {
        let btn = $(filterRow).find('.mapping-options__remove-filter');
        btn.removeClass('is--hidden');
        btn.on('click', () => {
            this.removeFilter(filterRow, indicatorDd, subindicatorDd);
        })
    }

    removeFilter(filterRow, indicatorDd, subindicatorDd) {
        $(filterRow).remove();
        this.filter.allDropdowns = this.filter.allDropdowns.filter((dd, el) => {
            return el !== indicatorDd && el !== subindicatorDd
        })

        this.filter.handleFilter(null);

        this.setAddFilterButton();
    }

    clearExtraFilters() {
        $(`${filterRowClass}[data-isextra=true]`).remove();
        
    }
}