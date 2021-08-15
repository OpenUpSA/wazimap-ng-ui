import { screen, fireEvent, getByText } from '@testing-library/dom'

import {MapChip} from "../../src/js/elements/mapchip/mapchip.js";
import {Component} from '../../src/js/utils';

import html from '../../src/index.html';

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
    const mapchip_colors = { "colors": [] }

    test('Description is visible and renders HTML tags', () => {
      let component = new Component();
      let mc = new MapChip(component, mapchip_colors)
      mc.show();
      mc.description = mapchip_args.data.description;

      let descriptionField = document.querySelector('.map-option__context_text');
      let htmlTag = descriptionField.textContent.trim();
      
      expect(descriptionField).toBeVisible();
      expect(descriptionField.innerHTML).toContain("<strong>");
      expect(htmlTag).toBe('An HTML description')
    })
})
