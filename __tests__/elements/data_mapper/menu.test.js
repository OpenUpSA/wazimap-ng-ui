import {filterIndicatorData} from "../../../src/js/elements/data_mapper/menu.js";


describe('Check data mapper menu order', () => {

    test('Check if categories are rendered according to order field in data', () => {
        let data = {
            "Demographics": {"order": 5, "name": 'Demographics', "subcategories": {}},
            "Education": {"order": 1, "name": 'Education', "subcategories": {}},
            "Youth Poverty": {"order": 3, "name": 'Youth Poverty', "subcategories": {}},
        }

        const orderedData = filterIndicatorData(data, []);
        expect(orderedData[0].name).toBe("Education");
        expect(orderedData[1].name).toBe("Youth Poverty");
        expect(orderedData[2].name).toBe("Demographics");
    });

    test('Check if subcategories are rendered according to order field in data', () => {
        let data = {
            "Demographics": {
                "order": 5, "name": 'Demographics', "subcategories": {
                    "Language": {"name": "Language", "order": 2, "indicators": {}},
                    "Migration": {"name": "Migration", "order": 3, "indicators": {}},
                    "Population": {"name": "Population", "order": 1, "indicators": {}},
                }
            },
        }

        const orderedData = filterIndicatorData(data, []);
        const subcategories = orderedData[0].subcategories;
        expect(subcategories[0].name).toBe("Population");
        expect(subcategories[1].name).toBe("Language");
        expect(subcategories[2].name).toBe("Migration");
    });

    test('Check if indicators are rendered according to order field in data', () => {
        let data = {
            "Economic Opportunities": {
                "order": 5, "name": 'Economic Opportunities', "subcategories": {
                    "Employment": {
                        "name": "Employment", "order": 2, "indicators": {
                            "Employment status": {
                                "order": 1,
                                "label": "Employment status",
                                "metadata": {"primary_group": "", "groups": []}
                            },
                            "Unemployment - Expanded": {
                                "order": 3,
                                "label": "Unemployment - Expanded",
                                "metadata": {"primary_group": "", "groups": []}
                            },
                            "Unemployment - Official": {
                                "order": 2,
                                "label": "Unemployment - Official",
                                "metadata": {"primary_group": "", "groups": []}
                            },
                        }
                    }
                }
            }
        }
        const orderedData = filterIndicatorData(data, []);
        const indicators = orderedData[0].subcategories[0].indicators;
        expect(indicators[0].label).toBe("Employment status");
        expect(indicators[1].label).toBe("Unemployment - Official");
        expect(indicators[2].label).toBe("Unemployment - Expanded");
    });
})
