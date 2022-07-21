import {configureLinechart} from "../../../src/js/profile/charts/lineChart";
import {TestData} from "../../../src/js/test_data";
import {parse, View} from 'vega';
import {Chart} from "../../../src/js/profile/chart";
import {Component} from "../../../src/js/utils";
import html from "../../../src/index.html";

describe('creating specs', () => {
    let data, metadata, config;
    beforeEach(() => {
        document.body.innerHTML = html;

        const td = new TestData();
        metadata = td.chartMetadata,
            data = td.chartData,
            config = td.chartConfig
    });

    test('line chart spec is created correctly', async () => {
        metadata.groups[0] = {
            "subindicators": [
                "Coloured",
                "Other",
                "Indian or Asian",
                "White",
                "Black African"
            ],
            "dataset": 1315,
            "name": "race",
            "can_aggregate": false,
            "can_filter": true
        }

        let vegaSpec = configureLinechart(data, metadata, config);
        const runtime = parse(vegaSpec)
        const view = new View(runtime);
        await view.runAsync();

        expect(view.signal('mainGroup')).toBe('age');
        expect(view.signal('numberFormat')).toStrictEqual({"percentage": ".0%", "value": ",.0f"});
        expect(JSON.stringify(view.data('data_formatted'))).toBe(JSON.stringify(
            [
                {
                    "age": 15,
                    "count": 1,
                    "TotalCount": 6,
                    "percentage": 0.16666666666666666,
                    [Symbol("vega_id")]: 7
                },
                {
                    "age": 12,
                    "count": 3,
                    "TotalCount": 6,
                    "percentage": 0.5,
                    [Symbol("vega_id")]: 8
                },
                {
                    "age": 14,
                    "count": 2,
                    "TotalCount": 6,
                    "percentage": 0.3333333333333333,
                    [Symbol("vega_id")]: 9
                }
            ])
        );
    })

    test('chart value type toggle is hidden and the chart is displayed in Value', async () => {
        let parent = new Component();
        let newdata = {
            data: data,
            metadata: metadata,
            chartConfiguration: config
        }

        newdata.chart_type = 'line';
        config.disableToggle = false;
        config.defaultType = 'Percentage';

        const node = document.querySelector('.profile-indicator');

        let chart = new Chart(parent, config, newdata, [], node, "TEST", "this is chart attribution");

        await new Promise(resolve => setTimeout(resolve, 1000));

        const percentageBtn = $(node).find(".hover-menu__content_list a[data-id='Percentage'] div").closest('.hover-menu__content_list');
        const valueBtn = $(node).find(".hover-menu__content_list a[data-id='Value'] div").closest('.hover-menu__content_list');

        const percentageBtnField = $(percentageBtn)[0];
        const valueBtnField = $(valueBtn)[0];

        expect(percentageBtnField).toHaveStyle('display: none')
        expect(valueBtnField).toHaveStyle('display: none')

        expect(chart.vegaView.signal('Units')).toBe('value');
    })
})