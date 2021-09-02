import html from '../../../src/index.html';
import {Component} from "../../../src/js/utils";
import {MapChip} from "../../../src/js/elements/mapchip/mapchip";
import {TestData} from "../../../src/js/test_data";

const mapchip_colors = {"colors": []};
let params;

describe('Filter controller', () => {
    beforeEach(() => {
        document.body.innerHTML = html;

        let td = new TestData();
        params = td.filterData;
    })

    test('Handles default filter dropdown correctly', () => {
        params.chartConfiguration.filter = {
            defaults: [
                {name: "gender", value: "Female"}
            ]
        }
        let component = new Component();
        let mc = new MapChip(component, mapchip_colors);

        mc.onSubIndicatorChange(params);
        let indicator = params.chartConfiguration.filter.defaults[0].name;
        let subindicator = params.chartConfiguration.filter.defaults[0].value;

        let indicatorDd = $(`.map-options__filters_content .map-options__filter-row .dropdown-menu__selected-item .truncate:contains("${indicator}")`);
        let subindicatorDd = $(`.map-options__filters_content .map-options__filter-row .dropdown-menu__selected-item .truncate:contains("${subindicator}")`);

        expect(mc._filterController.model.filterRows[0].indicatorDropdown._selectedItem.text()).toBe(indicator);
        expect(indicatorDd.length).toBe(1);

        expect(mc._filterController.model.filterRows[0].subIndicatorDropdown._selectedItem.text()).toBe(subindicator);
        expect(subindicatorDd.length).toBe(1);
    })

    test('If a default filter doesnt exist, some value is set', () => {
        params.chartConfiguration.filter = {
            defaults: [
                {name: "age", value: "17"}
            ]
        }
        params.primaryGroup = '';
        params.selectedSubindicator = '';

        let component = new Component();
        let mc = new MapChip(component, mapchip_colors);

        try {
          mc.onSubIndicatorChange(params);
        }
        catch(err) {
          // throw expected due to not finding the filter value
        }

        let filter = $('.mapping-options__filter_menu .dropdown-menu__trigger .dropdown-menu__selected-item .truncate');
        expect(filter[3].textContent).not.toBe('Select a value');
    })

    test('Handles non-aggregatable dropdown correctly', () => {
        params.groups[2].can_aggregate = false;
        let component = new Component();
        let mc = new MapChip(component, mapchip_colors);

        mc.onSubIndicatorChange(params);
        let indicator = params.groups[2].name;
        let subindicator = params.groups[2].subindicators[0];

        let indicatorDd = $(`.map-options__filters_content .map-options__filter-row .dropdown-menu__selected-item .truncate:contains("${indicator}")`);
        let subindicatorDd = $(`.map-options__filters_content .map-options__filter-row .dropdown-menu__selected-item .truncate:contains("${subindicator}")`);

        expect(mc._filterController.model.filterRows[0].indicatorDropdown._selectedItem.text()).toBe(indicator);
        expect(indicatorDd.length).toBe(1);

        expect(mc._filterController.model.filterRows[0].subIndicatorDropdown._selectedItem.text()).toBe(subindicator);
        expect(subindicatorDd.length).toBe(1);
    })

    test(('Does not create duplicate filter rows'), () => {
        params.groups[2].can_aggregate = false; //language
        params.chartConfiguration.filter = {
            defaults: [
                {name: "language", value: "English"}
            ]
        }
        let component = new Component();
        let mc = new MapChip(component, mapchip_colors);

        mc.onSubIndicatorChange(params);

        let indicatorDd = $(`.map-options__filters_content .map-options__filter-row .dropdown-menu__selected-item .truncate:contains("language")`);
        expect(indicatorDd.length).toBe(1);
    })

    test(('Does not create a filter row for the primary group'), () => {
        //primary group is age
        params.chartConfiguration.filter = {
            defaults: [
                {name: "age", value: "30-35"}
            ]
        }
        let component = new Component();
        let mc = new MapChip(component, mapchip_colors);

        mc.onSubIndicatorChange(params);

        let indicatorDd = $(`.map-options__filters_content .map-options__filter-row .dropdown-menu__selected-item .truncate:contains("age")`);
        expect(indicatorDd.length).toBe(0);
    })

    test('Hides filters when there are no groups to filter by', () => {
        params.groups = [];
        let component = new Component();
        let mc = new MapChip(component, mapchip_colors);

        mc.onSubIndicatorChange(params);
        let filterArea = document.querySelector('.map-options__filters_content');

        expect(filterArea).toHaveClass('hidden');
    })

    test('Does not hide filters when there are groups to filter by', () => {
        params.groups = [
            {
                subindicators: ["30-35", "20-24", "15-24 (Intl)", "15-35 (ZA)", "15-19", "25-29"],
                dataset: 241,
                name: "age",
                can_aggregate: true,
                can_filter: true
            },
            {
                subindicators: ["Female", "Male"],
                dataset: 241,
                name: "gender",
                can_aggregate: true,
                can_filter: true
            },
            {
                subindicators: ["Xitsonga", "Sign language", "isiNdebele", "Setswana", "Sesotho", "English", "Other", "Siswati", "Afrikaans", "Sepedi", "Tshivenda", "isiXhosa", "isiZulu"],
                dataset: 241,
                name: "language",
                can_aggregate: true,
                can_filter: true
            },
            {
                subindicators: ["Black African", "Indian or Asian", "Other", "Coloured", "White"],
                dataset: 241,
                name: "race",
                can_aggregate: true,
                can_filter: true
            }];
        let component = new Component();
        let mc = new MapChip(component, mapchip_colors);

        mc.onSubIndicatorChange(params);
        let filterArea = document.querySelector('.map-options__filters_content');

        expect(filterArea).not.toHaveClass('hidden');
    })
})
