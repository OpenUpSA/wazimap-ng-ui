import {SubindicatorFilter} from "../../src/js/profile/subindicator_filter";

const indicators = {
    'Age by race': {
        'groups': {
            'gender': {
                'Female': {'subindicator1': {'count': 10}, 'subindicator2': {'count': 20}},
                'Male': {'subindicator1': {'count': 30}, 'subindicator2': {'count': 40}},
            },
            'race': {
                'Race1': {'subindicator1': {'count': 50}, 'subindicator2': {'count': 60}},
                'Race2': {'subindicator1': {'count': 70}, 'subindicator2': {'count': 80}},
            },
        },
        'subindicators': [
            {label: 'subindicator1', "count": 90},
            {label: 'subindicator2', "count": 100},
        ]
    },
    'Another indicator': {}
} 

function testChartData(chartData, expectedData) {
    expect(chartData[0].value).toBe(expectedData[0].value);
    expect(chartData[0].label).toBe(expectedData[0].label);
    expect(chartData[1].value).toBe(expectedData[1].value);
    expect(chartData[1].label).toBe(expectedData[1].label);
}

describe('Testing Subindicator Filter', () => {
    const si = new SubindicatorFilter();
    const title = 'Age by race';
    si.indicators = indicators; 

    test.each([
        [{group: 'race', subindicator: 'Race2'}, indicators[title].groups.race.Race2],
        [{group: 'gender', subindicator: 'Female'}, indicators[title].groups.gender.Female],
    ])('Extract groups correctly', (value, expected) => {
        const chartData = si.getFilteredGroups(indicators[title].groups, value.group, value.subindicator)
        testChartData(chartData, [
            {label: 'subindicator1', value: expected.subindicator1.count},
            {label: 'subindicator2', value: expected.subindicator2.count},
        ])
    })

    test('Handles missing group correctly', () => {
        const chartData = si.getFilteredGroups(indicators[title].groups, 'Missing group', 'XXXXXX')
        expect(chartData.length).toBe(0)
    })

    test('Handles missing subindicator correctly', () => {
        const chartData = si.getFilteredGroups(indicators[title].groups, 'Gender', 'Missing subindicator')
        expect(chartData.length).toBe(0)
    })

    test('Extracts subindicators correctly', () => {
        const subindicators = si.getFilteredSubindicators(indicators[title].subindicators)
        testChartData(subindicators, [
            {label: 'subindicator1', value: 90},
            {label: 'subindicator2', value: 100}
        ])
    })

    test('Filters correctly', () => {
        let chartData = si.getFilteredData('All values', '', title)
        testChartData(chartData, [
            {label: 'subindicator1', value: 90},
            {label: 'subindicator2', value: 100}
        ])

        chartData = si.getFilteredData('Female', 'gender', title)
        testChartData(chartData, [
            {label: 'subindicator1', value: 10},
            {label: 'subindicator2', value: 20}
        ])

    })
})
