import {screen, fireEvent, getByText} from '@testing-library/dom'

import {MapChip} from "../../../src/js/elements/mapchip/mapchip.js";
import {Component} from '../../../src/js/utils';

import html from '../../../src/index.html';
import {TestData} from "../../../src/js/test_data";


const mapchip_colors = {"colors": []}

describe('Check mapchip HTML description', () => {
    document.body.innerHTML = html;

    const mapchip_args = {
        "data": {
            "description": "<p>An <strong>HTML</strong> description</p>",
            "metadata": {
                "primary_group": "age group",
                "groups": []
            },
            "chartConfiguration": {
                "filter": {
                    "defaults": []
                }
            }
        }
    }

    test('Description is visible and renders HTML tags', () => {
        let component = new Component();
        let mc = new MapChip(component, mapchip_colors)
        mc.show();
        mc.description = mapchip_args.data.description;

        let descriptionField = document.querySelector('.map-option__context_text');
        let htmlTag = descriptionField.textContent.trim();

        expect(descriptionField).toBeVisible();
        expect(htmlTag).toBe('An HTML description')
    })
})

describe('Selecting a subindicator', () => {
    beforeEach(() => {
        document.body.innerHTML = html;
    });
    let td = new TestData();
    let params = td.filterData;

    test('Handles mapchip visibility correctly', () => {
        let component = new Component();
        let mc = new MapChip(component, mapchip_colors);

        mc.onSubIndicatorChange(params);

        let mapOptions = document.querySelector('.map-options');
        expect(mapOptions).not.toHaveClass('hidden');
    })
})
