import {xAxis} from "./properties";
import {createFiltersForGroups} from "./utils";
import {index} from "d3-array";
import * as vega from "vega";

const PERCENTAGE_TYPE = "percentage";
const VALUE_TYPE = "value";
const graphValueTypes = {
    "Percentage": PERCENTAGE_TYPE,
    "Value": VALUE_TYPE
};

export const configureGroupedBarchart = (data, metadata, config) => {
    const {
        xTicks,
        defaultType,
        drilldown,
        colorRange,
        types: {
            Value: {formatting: valueFormatting, minX: valueMinX, maxX: valueMaxX},
            Percentage: {formatting: percentageFormatting, minX: percentageMinX, maxX: percentageMaxX}
        }
    } = config;
    const updatedData = getDataWithColors(data, metadata, colorRange, drilldown);

    const {primary_group: primaryGroup} = metadata;

    if (xTicks) {
        xAxis.tickCount = xTicks;
    }

    const {signals: filterSignals, filters} = createFiltersForGroups(metadata.groups);

    return {
        $schema: "https://vega.github.io/schema/vega/v5.json",
        description: "A",
        width: 800,
        background: "white",
        padding: {"left": 30, "top": 5, "right": 30, "bottom": 5},
        data: [
            {
                name: "table",
                values: updatedData,
                transform: [
                    ...filters
                ]
            },
            {
                name: "data_formatted",
                source: "table",
                transform: [
                    {
                        type: "aggregate",
                        ops: ["sum"],
                        as: ["count"],
                        fields: ["count"],
                        groupby: [drilldown, primaryGroup, 'groupedBarColor']
                    },
                    {
                        type: "joinaggregate",
                        as: ["TotalCount"],
                        ops: ["sum"],
                        fields: ["count"],
                        groupby: [drilldown]

                    },
                    {
                        type: "formula",
                        expr: "datum.TotalCount > 0.001 ? datum.count/datum.TotalCount : 0",
                        as: "percentage"
                    }
                ]
            },
            {
                name: "data_grouped",
                source: "table",
                transform: [
                    {
                        type: "aggregate",
                        ops: ["sum"],
                        as: ["count"],
                        fields: ["count"],
                        groupby: {signal: "groups"}
                    },
                ]
            }
        ],
        signals: [
            {
                name: "groups",
                value: [primaryGroup],
            },
            {
                name: "barvalue",
                value: "datum",
            },
            {
                name: "Units",
                value: graphValueTypes[defaultType]
            },
            {
                name: "applyFilter",
                value: false,
            },
            {
                name: "filterIndicator",
            },
            {
                name: "filterValue",
            },
            {
                name: "mainGroup",
                value: primaryGroup,
            },
            {
                name: "numberFormat",
                value: {percentage: percentageFormatting, value: valueFormatting},
            },
            {
                name: "datatype",
                value: {percentage: "percentage", value: "count"},
            },
            {
                name: "percentageMaxX",
                value: percentageMaxX !== "default" ? percentageMaxX : undefined,
            },
            {
                name: "percentageMinX",
                value: percentageMinX !== "default" ? percentageMinX : undefined
            },
            {
                name: "valueMaxX",
                value: valueMaxX !== "default" ? valueMaxX : undefined
            },
            {
                name: "valueMinX",
                value: valueMinX !== "default" ? valueMinX : undefined
            },
            {
                name: "domainMin",
                update: "Units === 'percentage' ? percentageMinX : valueMinX"
            },
            {
                name: "domainMax",
                update: "Units === 'percentage' ? percentageMaxX : valueMaxX"
            },
            {
                name: "test",
                update: "domain('yscale')"
            },
            {
                name: "height",
                //update: "domain('yscale').length * y_step + y_step"
                value: 60
            },
            {
                name: "yscale_step",
                value: 30
            },
            {
                name: "label_offset",
                value: -150
            },
            {
                name: "textAlign",
                value: "barvalue"
            },
            ...filterSignals
        ],
        scales: [
            {
                name: "yscale",
                type: "band",
                domain: {data: "data_formatted", field: {signal: "mainGroup"}},
                range: {"step": {signal: "yscale_step"}},
                padding: 0
            },
            {
                "name": "xscale",
                "type": "linear",
                "domain": {"data": "data_formatted", field: {signal: "datatype[Units]"}},
                "range": "width",
                "round": true,
                "zero": true,
                "nice": true
            },
            {
                "name": "color",
                "type": "ordinal",
                "domain": {"data": "data_formatted", "field": drilldown},
                "range": colorRange != null && colorRange.length > 0 ? colorRange : {"scheme": "category20"}
            }
        ],

        axes: [
            {
                "orient": "left",
                "labelPadding": 38,
                "labelAlign": "left",
                "labelOffset": {signal: "label_offset"},
                "scale": "yscale",
                "tickSize": 0,
                "zindex": 1,
                "labelColor": "#707070",
                "labelFontWeight": 700,
                domain: false
            },
            {
                "orient": "bottom",
                "scale": "xscale",
                bandPosition: 0,
                domainOpacity: 0.5,
                tickSize: 0,
                format: {signal: "numberFormat[Units]"},
                grid: true,
                gridOpacity: 0.5,
                labelOpacity: 0.5,
                labelPadding: 6
            }
        ],

        marks: [
            {
                "type": "group",
                "from": {
                    "facet": {
                        "data": "data_formatted",
                        "name": "facet",
                        "groupby": primaryGroup
                    }
                },

                "encode": {
                    "enter": {
                        "fill": {"value": "red"}
                    },
                    "update": {
                        "text": {"field": {"signal": "mainGroup"}},
                        "align": {"value": "left"},
                        "x": {"scale": "xscale", "field": {"signal": "mainGroup"}},
                        "y": {"scale": "yscale", "field": {"signal": "mainGroup"}, "offset": 10, "band": 0}
                    }
                },
                "signals": [{"name": "height", "update": "bandwidth('yscale')"}],
                "scales": [
                    {
                        "name": "pos",
                        "type": "band",
                        "range": {"step": 30},
                        "domain": {"data": "facet", "field": drilldown}
                    }
                ],
                marks: [{
                    "name": "bars",
                    from: {"data": "facet"},
                    "type": "rect",
                    "encode": {
                        "enter": {
                            "y": {"scale": "pos", "field": drilldown},
                            height: {scale: "pos", band: 0.9},
                            x: {scale: "xscale", field: {signal: "datatype[Units]"}},
                            "x2": {"scale": "xscale", "value": 0},
                            "fill": {"field": "groupedBarColor"}
                        },
                        "update": {
                            "y": {"scale": "pos", "field": drilldown},
                            height: {scale: "pos", band: 0.9},
                            x: {scale: "xscale", field: {signal: "datatype[Units]"}},
                            "x2": {"scale": "xscale", "value": 0},
                            tooltip: {
                                signal: `{'percentage': format(datum.percentage, numberFormat.percentage), 'group': datum[mainGroup] + ' - ' + datum['${drilldown}'], 'count': format(datum.count, numberFormat.value)}`
                            }
                        }
                    }
                }, {
                    "type": "text",
                    "from": {"data": "bars"},
                    "encode": {
                        "enter": {
                            "x": {"field": "x", "offset": 0},
                            "y": {"field": "y", "offset": {"field": "height", "mult": 0.5}},
                            "fill": [
                                {"value": "#707070"}
                            ],
                            "align": {"value": "right"},
                            "baseline": {"value": "middle"},
                            "text": {"field": `datum['${drilldown}']`},
                            "limit": {"value": 38}
                        },
                        "update": {
                            "x": {"field": "x", "offset": 0},
                            "y": {"field": "y", "offset": {"field": "height", "mult": 0.5}},
                            "fill": [
                                {"value": "#707070"}
                            ],
                            "align": {"value": "right"},
                            "baseline": {"value": "middle"},
                            "text": {"field": `datum['${drilldown}']`},
                            "limit": {"value": 38}
                        }
                    }
                }]
            }
        ],
    };
};

export const configureGroupedBarchartDownload = (data, metadata, config, annotations) => {
    let spec = configureGroupedBarchart(data, metadata, config);
    spec.signals.push({
        name: "title",
        value: annotations.title
    }, {
        name: "geography",
        value: annotations.geography
    }, {
        name: "chart_bottom",
        update: "height + 40"
    }, {
        name: "filters",
        value: annotations.filters
    }, {
        name: "attribution",
        value: annotations.attribution
    }, {
        name: "source",
        value: metadata.source !== undefined && metadata.source !== null && metadata.source.length > 0 ? `Source : ${metadata.source}` : ''
    });

    updateSignalValue(spec, 'Units', graphValueTypes[annotations.graphValueType]);

    spec.title = {
        text: {signal: "title"},
        subtitleFontStyle: "italic",
        anchor: "start",
        frame: "group"
    };

    spec.marks.push({
        type: "text",
        interactive: false,
        encode: {
            enter: {
                y: {signal: "chart_bottom"},
                text: {
                    "signal":
                        (annotations.attribution !== undefined && annotations.attribution.length > 0) ?
                            "[filters + geography, attribution, source]" :
                            "[filters + geography, source]"
                },
                baseline: {value: "bottom"},
                fontSize: {value: 14},
                fontWeight: {value: 500},
                fill: {value: "black"}
            }
        }
    })

    return spec;
};

function updateSignalValue(spec, name, value) {
    let ele = spec.signals.filter((s) => {
        return s.name === name
    })[0];

    ele.value = value;
}

function getDataWithColors(data, metadata, colorRange, drilldown) {
    const range  = colorRange.length > 0 ? colorRange : vega.scheme('category20')
    let updatedData = structuredClone(data);
    const selectedGroup = metadata.groups.filter(x => x.name === drilldown)[0];

    updatedData.forEach((ud) => {
        let colorIndex = selectedGroup['subindicators'].indexOf(ud[drilldown]);
        ud['groupedBarColor'] = range[colorIndex % range.length];
    });

    return updatedData;
}