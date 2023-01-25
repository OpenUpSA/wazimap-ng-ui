import {Component} from "../../src/js/utils";
import {Chart} from "../../src/js/profile/chart";
import {TestData} from "../../src/js/test_data";
import html from "../../src/app-shell.html";

let configureLinechart = require("../../src/js/profile/charts/lineChart");
let configureBarchart = require("../../src/js/profile/charts/barChart");

describe('displaying a chart', () => {
    let data, metadata, config;
    beforeEach(() => {
        document.body.innerHTML = html;

        const td = new TestData();
        metadata = td.chartMetadata,
            data = td.chartData,
            config = td.chartConfig
    });

    test('lineChart object is created when chart type is line', () => {
        let parent = new Component();
        let newdata = {
            data: data,
            metadata: metadata,
            chartConfiguration: {
                filter: {
                    defaults: []
                }
            }
        }
        const node = document.querySelector('.profile-indicator');

        newdata.chart_type = 'line';
        let spy = jest.spyOn(configureLinechart, 'configureLinechart');

        let chart = new Chart(parent, config, newdata, [], node, "TEST", "this is chart attribution");
        expect(spy).toBeCalled();
    })

    test('barChart object is created when chart type is bar', () => {
        let parent = new Component();
        let newdata = {
            data: data,
            metadata: metadata,
            chartConfiguration: {
                filter: {
                    defaults: []
                }
            }
        }
        const node = document.querySelector('.profile-indicator');

        newdata.chart_type = 'bar';
        let spy = jest.spyOn(configureBarchart, 'configureBarchart');

        let chart = new Chart(parent, config, newdata, [], node, "TEST", "this is chart attribution");
        expect(spy).toBeCalled();
    })

    test('barChart object is created when chart type is not defined', () => {
        let parent = new Component();
        let newdata = {
            data: data,
            metadata: metadata,
            chartConfiguration: {
                filter: {
                    defaults: []
                }
            }
        }
        const node = document.querySelector('.profile-indicator');

        let spy = jest.spyOn(configureBarchart, 'configureBarchart');

        let chart = new Chart(parent, config, newdata, [], node, "TEST", "this is chart attribution");
        expect(spy).toBeCalled();
    })

    test('chart value type toggle is hidden correctly', async () => {
        let parent = new Component();
        let newdata = {
            data: data,
            metadata: metadata,
            chartConfiguration: config
        }

        config.chartType = 'bar';
        config.disableToggle = true;
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

        expect(chart.vegaView.signal('Units')).toBe('percentage');
    })
})