import {Profile_header} from "../../src/js/profile/profile_header";
import {extractSheetsData} from "../../src/js/utils";

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
})