import {Choropleth} from "../../src/js/map/choropleth/choropleth";
import {Component} from "../../src/js/utils";
import SubindicatorCalculator from "../../src/js/map/choropleth/subindicator_calculator";

describe('choropleth', () => {
    let component;
    let layerStyler;
    let layerCache;
    let options;
    let calculator;
    let childData;
    let primaryGroup;
    let selectedSubindicator;
    let allSubindicators;

    beforeEach(() => {
        component = new Component();
        layerStyler = {
            "styles": {
                "hoverOnly": {
                    "over": {
                        "fillColor": "#3BAD84",
                        "fillOpacity": 0.5
                    },
                    "out": {
                        "fillColor": "#ffffff",
                        "stroke": false
                    }
                },
                "selected": {
                    "over": {
                        "color": "#666666",
                        "fillColor": "#3BAD84",
                        "fillOpacity": 0.6
                    },
                    "out": {
                        "color": "#666666",
                        "fillColor": "#cccccc",
                        "opacity": 0.5,
                        "fillOpacity": 0.5,
                        "weight": 1
                    }
                }
            }
        };
        layerCache = {};
        options = {
            "colors": [
                "#fef0d9",
                "#fdcc8a",
                "#fc8d59",
                "#e34a33",
                "#b30000"
            ],
            "opacity": 0.7,
            "opacity_over": 0.8
        };
        calculator = new SubindicatorCalculator();
        childData = {
            "Geography1": [
                {"count": 15, "age": "15-19"},
                {"count": 20, "age": "20-24"},
                {"count": 30, "age": "25-29"},
            ],
            "Geography2": [
                {"count": 20, "age": "15-19"},
                {"count": 10, "age": "20-24"},
                {"count": 30, "age": "25-29"},
            ]
        }
        primaryGroup = "age";
        selectedSubindicator = "15-19";
        allSubindicators = ["15-19", "20-24", "25-29"];
    })

    test('calculates the values correctly when choropleth range is by_subindicator', () => {
        const choropleth = new Choropleth(component, layerCache, layerStyler, options);
        choropleth.choroplethRangeType = 'by_subindicator';

        const {
            values,
            calculation
        } = choropleth.getChoroplethValues(calculator, childData, primaryGroup, selectedSubindicator, allSubindicators);

        expect(values).toStrictEqual([0.23076923076923078, 0.3333333333333333]);
        expect(calculation).toStrictEqual([
                {code: 'Geography1', val: 0.23076923076923078, total: 15},
                {code: 'Geography2', val: 0.3333333333333333, total: 20}
            ]
        );

        const intervals = choropleth.getIntervals(values);  //legend values
        expect(intervals).toStrictEqual([
                0.23076923076923078,
                0.2564102564102564,
                0.28205128205128205,
                0.3076923076923077,
                0.3333333333333333
            ]
        );
    })

    test('calculates the values correctly when choropleth range is by_indicator', () => {
        const choropleth = new Choropleth(component, layerCache, layerStyler, options);
        choropleth.choroplethRangeType = 'by_indicator';

        const {
            values,
            calculation
        } = choropleth.getChoroplethValues(calculator, childData, primaryGroup, selectedSubindicator, allSubindicators);

        expect(values).toStrictEqual([
            0.23076923076923078,
            0.3333333333333333,
            0.3076923076923077,
            0.16666666666666666,
            0.46153846153846156,
            0.5
        ]);
        expect(calculation).toStrictEqual([
                {code: 'Geography1', val: 0.23076923076923078, total: 15},
                {code: 'Geography2', val: 0.3333333333333333, total: 20}
            ]
        );

        const intervals = choropleth.getIntervals(values);  //legend values
        expect(intervals).toStrictEqual([
                0.16666666666666666,
                0.25,
                0.3333333333333333,
                0.4166666666666667,
                0.5
            ]
        );
    })

    test('calculates the values correctly when choropleth range is not set', () => {
        const choropleth = new Choropleth(component, layerCache, layerStyler, options);

        const {
            values,
            calculation
        } = choropleth.getChoroplethValues(calculator, childData, primaryGroup, selectedSubindicator, allSubindicators);

        expect(values).toStrictEqual([0.23076923076923078, 0.3333333333333333]);
        expect(calculation).toStrictEqual([
                {code: 'Geography1', val: 0.23076923076923078, total: 15},
                {code: 'Geography2', val: 0.3333333333333333, total: 20}
            ]
        );

        const intervals = choropleth.getIntervals(values);  //legend values
        expect(intervals).toStrictEqual([
                0.23076923076923078,
                0.2564102564102564,
                0.28205128205128205,
                0.3076923076923077,
                0.3333333333333333
            ]
        );
    })
})