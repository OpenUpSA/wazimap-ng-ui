import html from '../../../src/index.html';
import {Component} from "../../../src/js/utils";
import {MapChip} from "../../../src/js/elements/mapchip/mapchip";
import {TestData} from "../../../src/js/test_data";

const mapchip_colors = {"colors": []};
let params;
let mapBottomItems = '.map-bottom-items--v2';

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
})

describe('Visibility of the filter area', () => {
    beforeEach(() => {
        document.body.innerHTML = html;

        let td = new TestData();
        params = td.filterData;
    })

    test('Filters are visible when there are groups to filter by', () => {
        params.groups = [
            {
                subindicators: ["30-35", "20-24", "15-24 (Intl)", "14-35 (ZA)", "15-19", "25-29"],
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
        const isVisible = mc.filterController.shouldFiltersBeVisible();
        let filterArea = document.querySelector('.map-options__filters_content');
        let message = document.querySelector(`${mapBottomItems} .map-options__filters_content .map-options__no-data`);

        expect(isVisible).toBe(true);
        expect(filterArea).not.toHaveClass('hidden');
        expect(message).toHaveClass('hidden');
    })

    test('Warning message is shown when there are no groups to filter by', () => {
        params.groups = [];
        let component = new Component();
        let mc = new MapChip(component, mapchip_colors);

        mc.onSubIndicatorChange(params);
        const isVisible = mc.filterController.shouldFiltersBeVisible();
        let message = document.querySelector(`${mapBottomItems} .map-options__filters_content .map-options__no-data`);

        expect(isVisible).toBe(false);
        expect(message).not.toHaveClass('hidden');
    })

    test('Filters are visible when all the groups are non-aggregatable', () => {
        params.groups = [{
            subindicators: ["Female", "Male"],
            dataset: 241,
            name: "gender",
            can_aggregate: false,
            can_filter: true
        }];
        let component = new Component();
        let mc = new MapChip(component, mapchip_colors);

        mc.onSubIndicatorChange(params);
        const isVisible = mc.filterController.shouldFiltersBeVisible();
        const currentIndicatorValue = mc.filterController.model.filterRows[0].model.currentIndicatorValue;
        let filterArea = document.querySelector('.map-options__filters_content');

        expect(isVisible).toBe(true);
        expect(currentIndicatorValue).toBe('gender');
        expect(filterArea).not.toHaveClass('hidden');
    })

    test('Filters are visible when all the groups are default filter', () => {
        params.groups = [{
            subindicators: ["Female", "Male"],
            dataset: 241,
            name: "gender",
            can_aggregate: true,
            can_filter: true
        }];

        params.chartConfiguration.filter = {
            defaults: [{
                name: 'gender',
                value: 'Male'
            }]
        }

        let component = new Component();
        let mc = new MapChip(component, mapchip_colors);

        mc.onSubIndicatorChange(params);
        const isVisible = mc.filterController.shouldFiltersBeVisible();
        const currentIndicatorValue = mc.filterController.model.filterRows[0].model.currentIndicatorValue;
        const currentSubindicatorValue = mc.filterController.model.filterRows[0].model.currentSubindicatorValue;
        let filterArea = document.querySelector('.map-options__filters_content');

        expect(isVisible).toBe(true);
        expect(currentIndicatorValue).toBe('gender');
        expect(currentSubindicatorValue).toBe('Male');
        expect(filterArea).not.toHaveClass('hidden');
    })
})