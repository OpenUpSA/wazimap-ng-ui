import html from '../../../src/index.html';
import {TestData} from "../../../src/js/test_data";
import {Component} from "../../../src/js/utils";
import {MapChip} from "../../../src/js/elements/mapchip/mapchip";

const mapchip_colors = {"colors": []};
const mapBottomItems = '.map-bottom-items';
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

        let rowLength = $(`${mapBottomItems} .map-options__filters_content .map-options__filter-row`).length;
        let indicatorDd = $($(`${mapBottomItems} .map-options__filters_content .map-options__filter-row`)[rowLength - 1]).find('.mapping-options__filter_menu')[0];
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

        let rowLength = $(`${mapBottomItems} .map-options__filters_content .map-options__filter-row`).length;
        let subindicatorDd = $($(`${mapBottomItems} .map-options__filters_content .map-options__filter-row`)[rowLength - 1]).find('.mapping-options__filter')[1];

        expect(subindicatorDd).toHaveClass('disabled');
    })
})