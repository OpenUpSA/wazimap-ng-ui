import {screen, fireEvent, getByText} from '@testing-library/dom'

import {MapChip} from "../../../src/js/elements/mapchip/mapchip.js";
import {Component} from '../../../src/js/utils';

import html from '../../../src/index.html';


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
    let params = {
        chartConfiguration: {},
        childData: {
            EC: [
                {
                    age: "15-19",
                    race: "Black African",
                    count: "3599.3753699998",
                    gender: "Female",
                    language: "Afrikaans"
                },
                {age: "15-19", race: "Black African", count: "8665.81757999899", gender: "Female", language: "English"},
                {
                    age: "15-19",
                    race: "Black African",
                    count: "689.044740000004",
                    gender: "Female",
                    language: "isiNdebele"
                },
                {age: "15-19", race: "Black African", count: "288126.247378975", gender: "Female", language: "isiXhosa"}
            ],
            FS: [
                {
                    age: "15-19",
                    race: "Black African",
                    count: "3379.2461000001",
                    gender: "Female",
                    language: "Afrikaans"
                },
                {age: "15-19", race: "Black African", count: "2877.36439000009", gender: "Female", language: "English"},
                {
                    age: "15-19",
                    race: "Black African",
                    count: "528.385890000003",
                    gender: "Female",
                    language: "isiNdebele"
                },
                {age: "15-19", race: "Black African", count: "10071.9081699982", gender: "Female", language: "isiXhosa"}
            ]
        },
        description: '',
        groups: [
            {
            subindicators: ["30-35", "20-24", "15-24 (Intl)", "15-35 (ZA)", "15-19", "25-29"],
            dataset: 241,
            name: "age",
            can_aggregate: false,
            can_filter: true
        },
            {subindicators: ["Female", "Male"], dataset: 241, name: "gender", can_aggregate: true, can_filter: true},
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
            }],
        indicatorTitle: "Population by age group",
        primaryGroup: 'age',
        selectedSubindicator: '30-35'
    };

    test('Handles mapchip visibility correctly', () => {
        let component = new Component();
        let mc = new MapChip(component, mapchip_colors);

        mc.onSubIndicatorChange(params);

        let mapOptions = document.querySelector('.map-options');
        expect(mapOptions).not.toHaveClass('hidden');
    })
})
