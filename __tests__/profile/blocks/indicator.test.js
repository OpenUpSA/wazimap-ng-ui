import {Component} from "../../../src/js/utils";
import {Indicator} from "../../../src/js/profile/blocks/indicator";
import html from '../../../src/index.html';

const CHART_DATA = {
    data: [
        {count: "1203627", income: "R 153601 - R 307200"},
        {count: "1649796", income: "R 76801 - R 153600"},
        {count: "2469585", income: "R 19201 - R 38400"},
        {count: "1132167", income: "No income"},
        {count: "419334", income: "R 1 - R 4800"},
        {count: "796136", income: "R 4801 - R 9600"},
        {count: "2208054", income: "R 9601 - R 19200"},
        {count: "1940963", income: "R 38401 - R 76800"},
        {count: "494584", income: "R 307201 - R 614400"},
        {count: "155154", income: "R 614401- R 1228800"},
        {count: "50433", income: "R 1228801 - R 2457600"},
        {count: "37034", income: "R2457601 or more"},
        {count: "623210", income: "Unspecified"}],
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
                "R 1 - R 4800",
                "R 4801 - R 9600",
                "R 9601 - R 19200",
                "R 19201 - R 38400",
                "R 38401 - R 76800",
                "R 76801 - R 153600",
                "R 153601 - R 307200",
                "R 307201 - R 614400",
                "R 614401- R 1228800",
                "R 1228801 - R 2457600",
                "R2457601 or more",
                "Unspecified"
            ]
        }]
    }
}

describe('Indicator', () => {
    beforeEach(() => {
        document.body.innerHTML = html;
    })

    test('Handles chart data order correctly', () => {
        const component = new Component();
        const indicator = new Indicator(component, null, CHART_DATA, 'some title', false);
        indicator.orderChartData();
        let order = CHART_DATA.metadata.groups[0].subindicators;
        order.forEach((x, index) => {
            expect(indicator.indicator.data[index].income).toBe(x);
        })
    })
})