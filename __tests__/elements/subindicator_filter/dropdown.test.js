import html from '../../../src/index.html';
import {TestData} from "../../../src/js/test_data";
import {Component} from "../../../src/js/utils";
import {MapChip} from "../../../src/js/elements/mapchip/mapchip";

const mapchip_colors = {"colors": []};
let params;

describe('Dropdowns', () => {
    beforeEach(() => {
        document.body.innerHTML = html;

        let td = new TestData();
        params = td.filterData;
    })

    test('Indicator dropdown is populated correctly', () => {
        let component = new Component();
        let mc = new MapChip(component, mapchip_colors);

        mc.onSubIndicatorChange(params);

        let groups = ['All values'];
        params.groups.forEach((g) => {
            if (g.name !== params.primaryGroup) {
                groups.push(g.name);
            }
        })

        expect(JSON.stringify(mc._filterController.model.filterRows[0].indicatorDropdown.model.items)).toBe(JSON.stringify(groups));

        let rowLength = $('.map-options__filters_content .map-options__filter-row').length;
        let indicatorDd = $($('.map-options__filters_content .map-options__filter-row')[rowLength - 1]).find('.mapping-options__filter_menu')[0];
        let listItems = $(indicatorDd).find('.dropdown__list_item');
        let ddItems = [];
        for (let i = 0; i < listItems.length; i++) {
            let text = $(listItems[i]).find('.truncate').text();
            if (text !== 'Select an attribute' && text !== 'Attribute') {
                ddItems.push(text);
            }
        }

        expect(JSON.stringify(ddItems)).toBe(JSON.stringify(groups));
    })

    test('Subindicator dropdown is disabled', () => {
        let component = new Component();
        let mc = new MapChip(component, mapchip_colors);

        mc.onSubIndicatorChange(params);

        let rowLength = $('.map-options__filters_content .map-options__filter-row').length;
        let subindicatorDd = $($('.map-options__filters_content .map-options__filter-row')[rowLength - 1]).find('.mapping-options__filter')[1];

        expect(subindicatorDd).toHaveClass('disabled');
    })

    test('Selecting an indicator updates other indicator dropdowns items correctly', () => {
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

        mc._filterController.addEmptyFilter();

        expect(mc._filterController.model.filterRows[0].indicatorDropdown.model.items).toContain('gender');
        mc._filterController.model.filterRows[1].indicatorDropdown.model.currentItem = 'gender';
        expect(mc._filterController.model.filterRows[0].indicatorDropdown.model.items).not.toContain('gender');
    })

    test('Selecting a new indicator resets subindicator dropdown', () => {
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

        mc._filterController.model.filterRows[0].indicatorDropdown.model.currentItem = 'gender';
        expect(mc._filterController.model.filterRows[0].subIndicatorDropdown.model.items).toStrictEqual(["Female", "Male"]);

        mc._filterController.model.filterRows[0].subIndicatorDropdown.model.currentItem = 'Male';
        expect(mc._filterController.model.filterRows[0].subIndicatorDropdown.model.currentIndex).toBe("1");

        mc._filterController.model.filterRows[0].indicatorDropdown.model.currentItem = 'race';
        expect(mc._filterController.model.filterRows[0].subIndicatorDropdown.model.items).toStrictEqual(["Black African", "Indian or Asian", "Other", "Coloured", "White"]);
        expect(mc._filterController.model.filterRows[0].subIndicatorDropdown.model.currentIndex).toBe(0);
    })
})