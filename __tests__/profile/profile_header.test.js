import {Profile_header} from "../../src/js/profile/profile_header";
import {extractSheetsData} from "../../src/js/utils";
import {screen} from "@testing-library/dom";
import {Component} from '../../src/js/utils';
import {API} from '../../src/js/api';
import {FacilityItem} from "../../src/js/profile/facilities/facilityItem";

const FACILITIES = {
    count: 2,
    results: [{
        category: "Public Schools",
        features: [{
            properties: {
                name: 'DIRKIE UYS C/S',
                data: [{
                    "key": "phase",
                    "value": "Combined school (Gr 0 - 12)"
                }, {
                    "key": "sector",
                    "value": "Public"
                }, {
                    "key": "quintile",
                    "value": "4"
                }]
            },
            geometry: {
                coordinates: [
                    28.969743,
                    -27.836569
                ]
            }
        }, {
            properties: {
                name: 'VREDE C/S',
                data: [{
                    "key": "phase",
                    "value": "Combined school (Gr 0 - 12)"
                }, {
                    "key": "sector",
                    "value": "Public"
                }, {
                    "key": "quintile",
                    "value": "4"
                }]
            },
            geometry: {
                coordinates: [
                    28.969743,
                    -27.836569
                ]
            }
        }, {
            properties: {
                name: 'EVUNGWINI S/S',
                data: [{
                    "key": "phase",
                    "value": "Secondary school (Gr 8 - 12)"
                }, {
                    "key": "sector",
                    "value": "Public"
                }, {
                    "key": "quintile",
                    "value": "2"
                }]
            },
            geometry: {
                coordinates: [
                    28.969743,
                    -27.836569
                ]
            }
        }]
    }, {
        category: "Municipal Traffic Departments",
        features: [{
            properties: {
                name: 'Zamani Clinic',
                data: [{
                    "key": "telephone",
                    "value": "+27 58 924 0407"
                }, {
                    "key": "address",
                    "value": "Stand 707, Zamani, Free State, 2970"
                }]
            },
            geometry: {
                coordinates: [
                    28.969743,
                    -27.836569
                ]
            }
        }, {
            properties: {
                name: 'Thusa Bophelo Clinic',
                data: [{
                    "key": "telephone",
                    "value": "+27 58 643 0028"
                }, {
                    "key": "address",
                    "value": "Ezenzeleni Extension 2, Ezenzeleni, Warden, Free State, 9890"
                }]
            },
            geometry: {
                coordinates: [
                    28.969743,
                    -27.836569
                ]
            }
        }]
    }]
}

describe('profile header', () => {
    test('Creates sheets correctly', () => {
        const result = extractSheetsData(FACILITIES);

        expect(result.length).toBe(2);
        expect(result[1].sheetName).toBe('Municipal Traffic Departments');
        expect(result[0].sheetData[2].phase).toBe('Secondary school (Gr 8 - 12)');
    })
    let component = new Component();
    const parents = [];
    const geometries = {themes: []};
    const api = null;
    const geography = {code: 'ZA'};
    const config = {};

    test('initialize successully', () => {
        const header = new Profile_header(component, parents, geometries, api, 8, geography, config);
    })
})

describe('downloading facilities', () => {
    beforeEach(() => {
        document.body.innerHTML = `
<div class="rich-data-content">
    <div class="location__facilities">
        <div class="location__facilities_content">
            <div class="location__facilities_content-wrapper">
                <div class="location-facility">
                    <div class="location-facility__list">
                        <a href="#" class="location-facility__list_item w-inline-block">
                        <div class="location-facility__item_name">
                          <div class="truncate">Thusong centres (unverified)</div>
                        </div>
                        <div class="location-facility__item_value">
                          <div>140</div>
                        </div>
                        <div id="w-node-a4312e607bde-e148319d" class="location-facility__item_download" data-testid='download-btn'>
                          <div class="svg-icon small w-embed"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                              <path d="M0 0h24v24H0z" fill="none"></path>
                              <path fill="currentColor" d="M19,9h-4V3H9v6H5l7,7L19,9z M5,18v2h14v-2H5z"></path>
                            </svg>
                            </div>
                        </div>
                    </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>`;
    })

    test('download is enabled', () => {
        const component = new Component();
        const category = {
            label: 'test',
            count: 17
        }
        const facilityRowClone = $('body').find('.location-facility__list_item')[0].cloneNode(true);
        let f = new FacilityItem(component, facilityRowClone, category, true, false);
        const downloadBtn = $(f.facilityItem).find('.location-facility__item_download')[0];

        expect(downloadBtn).not.toHaveClass('hidden');
    })

    test('download is disabled', () => {
        const component = new Component();
        const category = {
            label: 'test',
            count: 17
        }
        const facilityRowClone = $('body').find('.location-facility__list_item')[0].cloneNode(true);
        let f = new FacilityItem(component, facilityRowClone, category, true, true);
        const downloadBtn = $(f.facilityItem).find('.location-facility__item_download')[0];

        expect(downloadBtn).toHaveClass('hidden');
    })
})
