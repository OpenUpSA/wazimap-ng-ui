import {xAxis, xScale} from "./properties";
import {createFiltersForGroups} from "./utils";

const PERCENTAGE_TYPE = "percentage";
const VALUE_TYPE = "value";
const graphValueTypes = {
    "Percentage": PERCENTAGE_TYPE,
    "Value": VALUE_TYPE
};

export const configureLinechart = (data, metadata, config) => {
    const {
        xTicks,
        defaultType,
        types: {
            Value: {formatting: valueFormatting, minX: valueMinX, maxX: valueMaxX},
            Percentage: {formatting: percentageFormatting, minX: percentageMinX, maxX: percentageMaxX}
        }
    } = config;

    const {primary_group: primaryGroup} = metadata;

    if (xTicks) {
        xAxis.tickCount = xTicks;
    }

    const {signals: filterSignals, filters} = createFiltersForGroups(metadata.groups);

    return {
        $schema: "https://vega.github.io/schema/vega/v5.json",
        description: "A",
        height: 400,
        width: 800,
        background: "white",
        padding: {"left": 30, "top": 5, "right": 30, "bottom": 5},
        data: [
            {
                name: "table",
                values: data,
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
                        groupby: {signal: "groups"}
                    },
                    {
                        type: "joinaggregate",
                        as: ["TotalCount"],
                        ops: ["sum"],
                        fields: ["count"]
                    },
                    {
                        type: "formula",
                        expr: "datum.TotalCount > 0.001 ? datum.count/datum.TotalCount : 0",
                        as: "percentage"
                    },
                    {
                        type: "extent",
                        field: "percentage",
                        signal: "percentage_extent"
                    },
                    {
                        type: "extent",
                        field: "count",
                        signal: "value_extent"
                    }
                ]
            }
        ],

        signals: [
            {
                name: "groups",
                value: [primaryGroup],
            },
            {
                name: "tooltip",
                value: {},
                on: [
                    {events: "rect:mouseover", update: "datum"},
                    {events: "rect:mouseout", update: "{}"}
                ]
            },
            {
                name: "mainGroup",
                value: primaryGroup,
            },
            {
                name: "datatype",
                value: {percentage: "percentage", value: "count"},
            },
            {
                name: "Units",
                value: graphValueTypes[defaultType]
            },
            {
                name: "numberFormat",
                value: {percentage: percentageFormatting, value: valueFormatting},
            },
            ...filterSignals
        ],

        scales: [
            {
                name: "xscale",
                type: "band",
                domain: {data: "data_formatted", field: {signal: "mainGroup"}},
                range: "width",
                padding: 1.5,
                round: true
            },
            {
                name: "yscale",
                domain: {data: "data_formatted", field: {signal: "datatype[Units]"}},
                nice: true,
                range: "height",
            }
        ],

        axes: [
            {
                orient: "bottom",
                scale: "xscale",
                grid: true,
                gridOpacity: 0.5
            },
            {
                orient: "left",
                scale: "yscale",
                labelPadding: 6,
                format: {
                    signal: "numberFormat[Units]"
                }
            }
        ],

        marks: [
            {
                type: "line",
                from: {data: "data_formatted"},
                encode: {
                    enter: {
                        x: {scale: "xscale", field: {signal: "mainGroup"}},
                        width: {scale: "xscale", band: 1},
                        y: {scale: "yscale", field: {signal: "datatype[Units]"}},
                        y2: {scale: "yscale", value: 0}
                    },
                    update: {
                        x: {scale: "xscale", field: {signal: "mainGroup"}},
                        y: {scale: "yscale", field: {signal: "datatype[Units]"}},
                        y2: {scale: "yscale", value: 0},
                        tooltip: {
                            signal: "{'percentage': format(datum.percentage, numberFormat.percentage), 'group': datum[mainGroup], 'count': format(datum.count, numberFormat.value)}"
                        }
                    },
                }
            }
        ]
    }
};

export const configureLinechartDownload = (data, metadata, config, annotations) => {
    return configureLinechart(data, metadata, config);
}