import html from '../../../src/index.html';
import {TestData} from "../../../src/js/test_data";
import {Component} from "../../../src/js/utils";
import {MapChip} from "../../../src/js/elements/mapchip/mapchip";
import {DataFilterModel} from "../../../src/js/models/data_filter_model";

const mapchip_colors = {"colors": []};
let params;
let mapBottomItems = '.map-bottom-items--v2';

describe('Add filter button', () => {
    beforeEach(() => {
        document.body.innerHTML = html;

        let td = new TestData();
        params = td.filterData;
    })

    test('Adds a filter row', () => {
        // replaced by data_mapper.feature
    })

    test('Is enabled', () => {
        // replaced by mapchip_filter_row.feature
    })

    test('Is disabled', () => {
        // replaced by mapchip_filter_row.feature
    })
})
