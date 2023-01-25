import html from '../../../src/app-shell.html';
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
        let component = new Component();
        let mc = new MapChip(component, mapchip_colors);

        let dataFilterModel = new DataFilterModel(params.groups, params.chartConfiguration.filter, [], params.primaryGroup, params.childData);
        mc.setFilterController(dataFilterModel);

        let prevFilterRow = $('.map-options__filters_content .map-options__filter-row').length;
        $('.mapping-options__add-filter').trigger('click');
        let afterFilterRow = $('.map-options__filters_content .map-options__filter-row').length;

        expect(afterFilterRow).toBe(prevFilterRow + 1);
    })

    test('Is enabled', () => {
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

        let dataFilterModel = new DataFilterModel(params.groups, params.chartConfiguration.filter, [], params.primaryGroup, params.childData);
        mc.setFilterController(dataFilterModel);

        let btn = document.querySelector('.mapping-options__add-filter');
        expect(btn).not.toHaveClass('disabled');
    })

    test('Is disabled', () => {
        params.groups = [{
            subindicators: ["Female", "Male"],
            dataset: 241,
            name: "gender",
            can_aggregate: false,
            can_filter: true
        }];

        let component = new Component();
        let mc = new MapChip(component, mapchip_colors);

        let dataFilterModel = new DataFilterModel(params.groups, params.chartConfiguration.filter, [], params.primaryGroup, params.childData);
        mc.setFilterController(dataFilterModel);

        let btn = document.querySelector(`${mapBottomItems} .mapping-options__add-filter`);
        expect(btn).toHaveClass('disabled');
    })
})
