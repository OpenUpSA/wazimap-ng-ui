import {Component} from "../../src/js/utils";
import {Chart} from "../../src/js/profile/chart";
import {TestData} from "../../src/js/test_data";

let configureLinechart = require("../../src/js/profile/charts/lineChart");
let configureBarchart = require("../../src/js/profile/charts/barChart");

describe('displaying a chart', () => {
    let data, metadata, config;
    beforeEach(() => {
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
        $(node).find(".hover-menu__content_list a[data-id='Percentage'] div")
            .text('Percentage test')
            .closest('a')
            .attr('data-testid', 'percentage-btn');

        config.chartType = 'line';
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
        $(node).find(".hover-menu__content_list a[data-id='Percentage'] div")
            .text('Percentage test')
            .closest('a')
            .attr('data-testid', 'percentage-btn');

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
        $(node).find(".hover-menu__content_list a[data-id='Percentage'] div")
            .text('Percentage test')
            .closest('a')
            .attr('data-testid', 'percentage-btn');

        let spy = jest.spyOn(configureBarchart, 'configureBarchart');

        let chart = new Chart(parent, config, newdata, [], node, "TEST", "this is chart attribution");
        expect(spy).toBeCalled();
    })
})