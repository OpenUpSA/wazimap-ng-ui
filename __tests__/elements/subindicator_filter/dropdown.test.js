import html from '../../../src/index.html';
import {TestData} from "../../../src/js/test_data";
import {Component} from "../../../src/js/utils";
import {MapChip} from "../../../src/js/elements/mapchip/mapchip";
import {DataFilterModel} from "../../../src/js/models/data_filter_model";

const mapchip_colors = {"colors": []};
const mapBottomItems = '.map-bottom-items--v2';
let params;

describe('Dropdowns', () => {
    beforeEach(() => {
        document.body.innerHTML = html;

        let td = new TestData();
        params = td.filterData;
    })

    test('Indicator dropdown is populated correctly', () => {
        // replaced by data_mapper.feature & mapchip_filter_row.feature & mapchip.feature
    })

    test('Subindicator dropdown is disabled', () => {
        // replaced by data_mapper.feature & mapchip_filter_row.feature & mapchip.feature
    })
})
