import {screen, fireEvent, getByText} from '@testing-library/dom'

import * as L from 'leaflet';
import {MapControl} from '../../src/js/map/maps';
import {PointData} from "../../src/js/map/point_data/point_data.js";
import {Component} from '../../src/js/utils';

import html from '../../src/app-shell.html';
import {TestPointData, TestMapControlConfigData} from "../../src/js/test_data";


function getLabel(facility){
  return facility.querySelector(".facility-info__item_label");
}

function getValue(facility){
  return facility.querySelector(".facility-info__item_value");
}

describe('Check point data HTML description', () => {
    document.body.innerHTML = html;
    const pointDataConfig = {
      config: {
        point_markers: {}
      }
    }

    test('Description is rendered with HTML tags according to config', () => {
        // Setup
        let component = new Component();
        let testMapControlClass = new TestMapControlConfigData();
        let mapcontrol = new MapControl(
          this, testMapControlClass.mapControlConfig, false
        );
        let testPointData = new TestPointData();
        let pointData = new PointData(component, '', mapcontrol.map, '', pointDataConfig)
        pointData.showFacilityModal(testPointData.pointData);

        // asserts
        let facilityItems = document.querySelectorAll('.facility-info__item');

        // Test for Allowed tag
        let facilityLabel = getLabel(facilityItems[0]);
        let facilityValue = getValue(facilityItems[0]);
        expect(facilityLabel.textContent).toBe('Test allowed Tag');
        expect(facilityValue.firstChild.nodeType).toBe(1);
        expect(facilityValue.innerHTML).toContain("<b>");
        expect(facilityValue.innerHTML).toBe('<b>Bold Text</b>');
        expect(facilityValue.textContent).toBe('Bold Text');

        // Test for unallowed tag
        facilityLabel = getLabel(facilityItems[1]);
        facilityValue = getValue(facilityItems[1]);
        expect(facilityLabel.textContent).toBe('Test unallowed Tag');
        expect(facilityValue.firstChild.nodeType).toBe(3);
        expect(facilityValue.innerHTML).not.toContain('<strong>');
        expect(facilityValue.innerHTML).toBe('Strong Text');
        expect(facilityValue.textContent).toBe('Strong Text');


        // Test Unordered list
        facilityLabel = getLabel(facilityItems[2]);
        facilityValue = getValue(facilityItems[2]);
        expect(facilityLabel.textContent).toBe('Test Unordered List');
        expect(facilityValue.firstChild.nodeType).toBe(1);
        expect(facilityValue.innerHTML).toContain('<ul>');
        expect(facilityValue.innerHTML).toContain('<li>');
        expect(facilityValue.innerHTML).toBe('<ul><li>First Point</li> <li>Second Point</li></ul>');

        // Test Custom Style Attr
        facilityLabel = getLabel(facilityItems[3]);
        facilityValue = getValue(facilityItems[3]);
        expect(facilityLabel.textContent).toBe('Test Custom Style Attr');
        expect(facilityValue.firstChild.nodeType).toBe(1);
        expect(facilityValue.innerHTML).toContain('style');
        expect(facilityValue.innerHTML).toBe('<p style="color: red">Red Text</p>');
        expect(facilityValue.textContent).toBe('Red Text');

        // Test Class
        facilityLabel = getLabel(facilityItems[4]);
        facilityValue = getValue(facilityItems[4]);
        expect(facilityLabel.textContent).toBe('Test Class Attr');
        expect(facilityValue.firstChild.nodeType).toBe(1);
        expect(facilityValue.innerHTML).toContain('class');
        expect(facilityValue.innerHTML).toBe('<div class="test-class">test</div>');
        expect(facilityValue.textContent).toBe('test');

        // Test Link
        facilityLabel = getLabel(facilityItems[5]);
        facilityValue = getValue(facilityItems[5]);
        expect(facilityLabel.textContent).toBe('Test Link');
        expect(facilityValue.firstChild.nodeType).toBe(1);
        expect(facilityValue.innerHTML).toContain('href');
        expect(facilityValue.innerHTML).toBe('<a href="#">This is Link to some Report</a>');
        expect(facilityValue.textContent).toBe('This is Link to some Report');

        // Test Script
        facilityLabel = getLabel(facilityItems[6]);
        facilityValue = getValue(facilityItems[6]);
        expect(facilityLabel.textContent).toBe('Test Script');
        expect(facilityValue.firstChild.nodeType).toBe(3);
        expect(facilityValue.innerHTML).not.toContain('<script>');
        expect(facilityValue.innerHTML).toBe("console.log('testing')");
        expect(facilityValue.textContent).toBe("console.log('testing')");

        // Test link with onclick
        facilityLabel = getLabel(facilityItems[7]);
        facilityValue = getValue(facilityItems[7]);
        expect(facilityLabel.textContent).toBe('Test link with onclick');
        expect(facilityValue.firstChild.nodeType).toBe(1);
        expect(facilityValue.innerHTML).toContain('href');
        expect(facilityValue.innerHTML).not.toContain('onclick');
        expect(facilityValue.innerHTML).not.toContain('alert');
        expect(facilityValue.innerHTML).toBe('<a href="#">click me</a>');
        expect(facilityValue.textContent).toBe('click me');

        // Test html but not defined in config as html
        facilityLabel = getLabel(facilityItems[8]);
        facilityValue = getValue(facilityItems[8]);
        expect(facilityLabel.textContent).toBe('Test Links but field_type text');
        expect(facilityValue.firstChild.nodeType).toBe(3);
        expect(facilityValue.innerHTML).toBe("&lt;a href='#'&gt;This is Link to some Report&lt;/a&gt;");
        expect(facilityValue.textContent).toBe("<a href='#'>This is Link to some Report</a>");
    })
})
