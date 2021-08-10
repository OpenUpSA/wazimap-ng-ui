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