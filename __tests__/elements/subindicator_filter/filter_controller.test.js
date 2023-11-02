import html from '../../../src/index.html';
import {Component} from "../../../src/js/utils";
import {MapChip} from "../../../src/js/elements/mapchip/mapchip";
import {TestData} from "../../../src/js/test_data";
import {DataFilterModel} from "../../../src/js/models/data_filter_model";

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
        // replaced by data_mapper.feature
    })

    test('Handles non-aggregatable dropdown correctly', () => {
        // replaced by data_mapper.feature
    })

    test(('Does not create duplicate filter rows'), () => {
        // replaced by data_mapper.feature
    })

    test(('Does not create a filter row for the primary group'), () => {
        // replaced by mapchip_filter_row.feature
    })
})

describe('Visibility of the filter area', () => {
    beforeEach(() => {
        document.body.innerHTML = html;

        let td = new TestData();
        params = td.filterData;
    })

    test('Filters are visible when there are groups to filter by', () => {
        // replaced by mapchip_filter_row.feature
    })

    test('Warning message is shown when there are no groups to filter by', () => {
        // replaced by mapchip_filter_row.feature
    })

    test('Filters are visible when all the groups are non-aggregatable', () => {
        // replaced by mapchip_filter_row.feature
    })

    test('Filters are visible when all the groups are default filter', () => {
        // replaced by mapchip_filter_row.feature
    })
})
