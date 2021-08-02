import { screen, fireEvent, getByText } from '@testing-library/dom'

import {MapChip} from "../../src/js/elements/mapchip.js";
import {Component} from '../../src/js/utils';


describe('Check mapchip HTML description', () => {
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
    
    beforeEach(() => {
        document.body.innerHTML = `
        <div class="map-options__legend">
          <div class="map-options__legend_label">
            <div>LEGEND:</div>
          </div>
          <div class="map-options__legend_wrap">
            <div class="map_legend-block"></div>
          </div>
        </div>
        
        <div class="map-options__context">
          <div class="map-option__context_text" data-testid="mapchip-html-description"></div>
        </div>
        `;
      })
    
    test('Description renderes HTML tags', () => {
      let component = new Component();
      let mc = new MapChip(component, mapchip_colors)
      mc.showMapChip(mapchip_args);
      
      expect(screen.getByTestId('mapchip-html-description')).toHaveTextContent('An HTML description')
    })
})
