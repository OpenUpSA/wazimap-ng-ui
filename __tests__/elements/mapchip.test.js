import { screen, fireEvent, getByText } from '@testing-library/dom'

import {MapChip} from "../../src/js/elements/mapchip.js";
import {Component} from '../../src/js/utils';

import html from '../../src/index.html';

describe('Check mapchip HTML description', () => {
    document.body.innerHTML = html;

    const mapchip_args = {
        "data": {
            "description": "<p>An HTML description</p>",
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

    const mapchip_colors = {
        "colors": [
            "#fef0d9",
            "#fdcc8a",
            "#fc8d59",
            "#e34a33",
            "#b30000"
        ]
    }

    let descriptionField;

    beforeEach(() => {
      descriptionField = document.querySelector('.mapchip-html-description');
    })

    test('Description renders HTML tags', () => {
      let component = new Component();
      let mc = new MapChip(component, mapchip_colors)
      mc.showMapChip(mapchip_args);

      expect(descriptionField).toBe('An HTML description')
    })
})
