import {Component} from "../../../src/js/utils";
import {Indicator} from "../../../src/js/profile/blocks/indicator";
import html from '../../../src/index.html';

const CHART_DATA = {
    data: [
        {count: "1203627", income: "R 153601 - R 307200", gender: "Male"},
        {count: "1649796", income: "R 76801 - R 153600", gender: "Male"},
        {count: "2469585", income: "R 19201 - R 38400", gender: "Male"},
        {count: "1132167", income: "No income", gender: "Male"},
        {count: "1203627", income: "R 153601 - R 307200", gender: "Female"},
        {count: "1649796", income: "R 76801 - R 153600", gender: "Female"},
        {count: "2469585", income: "R 19201 - R 38400", gender: "Female"},
        {count: "1132167", income: "No income", gender: "Female"},
    ],
    groups: [],
    chartConfiguration: {
        disableToggle: false,
        defaultType: "Percentage",
        types: {
            Percentage: {formatting: ".0%", minX: "default", maxX: "default"},
            Value: {formatting: ",.0f", minX: "default", maxX: "default"}
        },
        xTicks: null
    },
    metadata: {
        primary_group: "income",
        groups: [{
            name: "income",
            subindicators: [
                "No income",
                "R 76801 - R 153600",
                "R 19201 - R 38400",
                "R 153601 - R 307200",
            ]
        },
            {
                name: "gender",
                subindicators: [
                    "Female",
                    "Male"
                ]
            }]
    },
    version_data: {
        model: {
            isActive: true
        }
    }
}

describe('Indicator', () => {
    beforeEach(() => {
        document.body.innerHTML = html;
    })

    test('Handles chart data order correctly', () => {
        const component = new Component();
        const indicator = new Indicator(component, null, CHART_DATA, 'some title', false, null, 'this is the chart attribution', false);
        indicator.orderChartData();
        let order = [
            "No income",
            "No income",
            "R 76801 - R 153600",
            "R 76801 - R 153600",
            "R 19201 - R 38400",
            "R 19201 - R 38400",
            "R 153601 - R 307200",
            "R 153601 - R 307200",
        ]
        order.forEach((x, index) => {
            expect(indicator.indicator.data[index].income).toBe(x);
        })
    })
})