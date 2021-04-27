import {Profile_header} from "../../src/js/profile/profile_header";

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
            }
        }]
    }]
}

describe('profile header', () => {
    const parents = [];
    const geometries = {themes: []}

    test('initialize successully', () => {
        const header = new Profile_header(parents, geometries);
    })

    const header = new Profile_header(parents, geometries);
    const result = header.createExcelData(FACILITIES);

    test('Creates sheets correctly',() => {
        expect(result.length).toBe(2);
        expect(result[1].sheetName).toBe('Municipal Traffic Departments');
        expect(result[0].sheetData[2].phase).toBe('Secondary school (Gr 8 - 12)');
    })
})