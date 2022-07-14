import {Component} from "../../src/js/utils";
import {Chart} from "../../src/js/profile/chart";
import {TestData} from "../../src/js/test_data";
import html from "../../src/index.html";

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

        config.chartType = 'bar';
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
})