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
                        groupby: [primaryGroup]
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
            },
            {
                name: "highlightedPoint",
                source: "data_formatted",
                transform: [
                    {
                        type: "filter",
                        expr: "hover && hover.datum.age === datum.age && hover.datum.count === datum.count"
                    }
                ]
            }
        ],

        signals: [
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
            {
                name: "labelColor",
                value: "grey"
            },
            {
                name: "hover",
                value: null,
                on: [
                    {"events": "@points_voronoi:mouseover", "update": "datum"},
                    {"events": "@points_voronoi:mouseout", "update": "null"}
                ]
            },
            ...filterSignals
        ],

        scales: [
            {
                domain: {data: "data_formatted", field: {signal: "mainGroup"}},
                name: "xscale",
                range: "width",
                type: "point"
            },
            {
                domain: {data: "data_formatted", field: {signal: "datatype[Units]"}},
                name: "yscale",
                nice: true,
                range: "height",
                type: "linear",
                zero: false
            },
            {
                name: "color",
                range: "category",
                type: "ordinal"
            }
        ],

        axes: [
            {
                grid: true,
                orient: "bottom",
                scale: "xscale",
                labelFlush: true,
                labelOverlap: true,
                labelColor: {
                    signal: "labelColor"
                },
                gridOpacity: 0.5,
            },
            {
                grid: false,
                orient: "left",
                scale: "yscale",
                labelPadding: 6,
                labelColor: {
                    signal: "labelColor"
                }
            }
        ],

        marks: [
            {
                marks: [
                    {
                        // creates the line
                        encode: {
                            update: {
                                stroke: {value: 1, scale: "color"},
                                strokeWidth: {value: 2},
                                x: {field: {signal: "mainGroup"}, scale: "xscale"},
                                y: {field: {signal: "datatype[Units]"}, scale: "yscale"},
                                fillOpacity: {value: 1}
                            }
                        },
                        from: {data: "data_formatted"},
                        type: "line"
                    },
                    {
                        // creates the points on the line
                        name: "points_on_line",
                        from: {data: "data_formatted"},
                        type: "symbol",
                        encode: {
                            update: {
                                fill: {value: "transparent"},
                                size: {value: 10},
                                stroke: {value: "transparent"},
                                strokeWidth: {value: 0.5},
                                x: {field: {signal: "mainGroup"}, scale: "xscale"},
                                y: {field: {signal: "datatype[Units]"}, scale: "yscale"}
                            }
                        }
                    },
                    {
                        // creates a path in the background to decide which point is the closest to the cursor
                        name: "points_voronoi",
                        type: "path",
                        from: {data: "points_on_line"},
                        encode: {
                            update: {
                                fill: {value: "transparent"},
                                strokeWidth: {value: 0.35},
                                stroke: {value: "red"},
                                strokeOpacity: {value: 0},  //we need this for the tooltip but we don't need it to be visible
                                isVoronoi: {value: true},
                                tooltip: {
                                    signal: "{'percentage': format(datum.datum.percentage, numberFormat.percentage), 'group': datum.datum[mainGroup], 'count': format(datum.datum.count, numberFormat.value)}"
                                }
                            }
                        },
                        transform: [
                            {
                                type: "voronoi",
                                x: "datum.x",
                                y: "datum.y",
                                size: [{signal: "width"}, {signal: "height"}]
                            }
                        ]
                    },
                    {
                        // makes the closes point on the line visible
                        from: {data: "highlightedPoint"},
                        type: "symbol",
                        interactive: false,
                        encode: {
                            update: {
                                x: {scale: "xscale", field: {signal: "mainGroup"}},
                                y: {scale: "yscale", field: {signal: "datatype[Units]"}},
                                stroke: {value: "green"},
                                strokeWidth: {value: 4},
                                fill: {value: "white"},
                                size: {value: 150},
                                strokeOpacity: {value: 0.3}
                            }
                        }
                    }
                ],
                type: "group"
            }
        ],
    }
};

export const configureLinechartDownload = (data, metadata, config, annotations) => {
    let spec = configureLinechart(data, metadata, config);
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
}

function updateSignalValue(spec, name, value) {
    let ele = spec.signals.filter((s) => {
        return s.name === name
    })[0];

    ele.value = value;
}