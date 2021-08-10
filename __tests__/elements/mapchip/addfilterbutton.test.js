import html from '../../../src/index.html';
import {TestData} from "../../../src/js/test_data";
import {Component} from "../../../src/js/utils";
import {MapChip} from "../../../src/js/elements/mapchip/mapchip";

const mapchip_colors = {"colors": []};
let params;

describe('Add filter button', () => {
    beforeEach(() => {
        document.body.innerHTML = html;

        let td = new TestData();
        params = td.filterData;
    })

    test('Adds a filter row', () => {
        let component = new Component();
        let mc = new MapChip(component, mapchip_colors);

        mc.onSubIndicatorChange(params);

        let prevFilterRow = $('.map-options__filters_content .map-options__filter-row').length;
        $('.mapping-options__add-filter').trigger('click');
        let afterFilterRow = $('.map-options__filters_content .map-options__filter-row').length;

        expect(afterFilterRow).toBe(prevFilterRow + 1);
    })
})