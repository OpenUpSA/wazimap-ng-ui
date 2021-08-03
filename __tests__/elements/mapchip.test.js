import { screen, fireEvent, getByText } from '@testing-library/dom'

import {MapChip} from "../../src/js/elements/mapchip/mapchip.js";
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
    const mapchip_colors = { "colors": [] }
    let descriptionField;

    beforeEach(() => {
      descriptionField = document.querySelector('.map-option__context_text');
    })

    test('Description is visible and renders HTML tags', () => {
      let component = new Component();
      let mc = new MapChip(component, mapchip_colors)
      mc.show();
      mc.description = mapchip_args.data.description;
      
      expect(descriptionField).toBeVisible();
      expect(descriptionField.textContent.trim()).toBe('An HTML description')
    })
})
