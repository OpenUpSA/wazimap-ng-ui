export class TestData {
    constructor() {
        this.filterData = {
            chartConfiguration: {},
            childData: {
                EC: [
                    {
                        age: "15-19",
                        race: "Black African",
                        count: "3599.3753699998",
                        gender: "Female",
                        language: "Afrikaans"
                    },
                    {
                        age: "15-19",
                        race: "Black African",
                        count: "8665.81757999899",
                        gender: "Female",
                        language: "English"
                    },
                    {
                        age: "15-19",
                        race: "Black African",
                        count: "689.044740000004",
                        gender: "Female",
                        language: "isiNdebele"
                    },
                    {
                        age: "15-19",
                        race: "Black African",
                        count: "288126.247378975",
                        gender: "Female",
                        language: "isiXhosa"
                    }
                ],
                FS: [
                    {
                        age: "15-19",
                        race: "Black African",
                        count: "3379.2461000001",
                        gender: "Female",
                        language: "Afrikaans"
                    },
                    {
                        age: "15-19",
                        race: "Black African",
                        count: "2877.36439000009",
                        gender: "Female",
                        language: "English"
                    },
                    {
                        age: "15-19",
                        race: "Black African",
                        count: "528.385890000003",
                        gender: "Female",
                        language: "isiNdebele"
                    },
                    {
                        age: "15-19",
                        race: "Black African",
                        count: "10071.9081699982",
                        gender: "Female",
                        language: "isiXhosa"
                    }
                ]
            },
            description: '',
            groups: [
                {
                    subindicators: ["30-35", "20-24", "15-24 (Intl)", "15-35 (ZA)", "15-19", "25-29"],
                    dataset: 241,
                    name: "age",
                    can_aggregate: true,
                    can_filter: true
                },
                {
                    subindicators: ["Female", "Male"],
                    dataset: 241,
                    name: "gender",
                    can_aggregate: true,
                    can_filter: true
                },
                {
                    subindicators: ["Xitsonga", "Sign language", "isiNdebele", "Setswana", "Sesotho", "English", "Other", "Siswati", "Afrikaans", "Sepedi", "Tshivenda", "isiXhosa", "isiZulu"],
                    dataset: 241,
                    name: "language",
                    can_aggregate: true,
                    can_filter: true
                },
                {
                    subindicators: ["Black African", "Indian or Asian", "Other", "Coloured", "White"],
                    dataset: 241,
                    name: "race",
                    can_aggregate: true,
                    can_filter: true
                }],
            indicatorTitle: "Population by age group",
            primaryGroup: 'age',
            selectedSubindicator: '30-35',
            enable_linear_scrubber: false
        };

        this.chartMetadata = {
            source: "Census 2021",
            primary_group: "age",
            groups: [{name: "age"}]
        };

        this.chartConfig = {
            types: {
                Value: {
                    formatting: ",.0f",
                    minX: "default",
                    maxX: "default"
                },
                Percentage: {
                    formatting: ".0%",
                    minX: "default",
                    maxX: "default"
                }
            },
            disableToggle: false,
            defaultType: "Value",
            xTicks: null
        };

        this.chartData = [
            {age: 15, gender: 'male', count: 1},
            {age: 12, gender: 'female', count: 3},
            {age: 14, gender: 'male', count: 2}
        ];
    }
}


export class TestPointData {
    constructor() {
        this.pointData = {
            x: 23.06241,
            y: -28.33792,
            name: "Test Point",
            data: [
                {
                    "key": "Test allowed Tag",
                    "value": "<b>Bold Text</b>"
                },
                {
                    "key": "Test unallowed Tag",
                    "value": "<strong>Strong Text</strong>"
                },
                {
                    "key": "Test Unordered List",
                    "value": "<ul><li>First Point</li> <li>Second Point</li></ul>"
                },
                {
                    "key": "Test Custom Style Attr",
                    "value": "<p style='color: red'>Red Text</p>"
                },
                {
                    "key": "Test Class Attr",
                    "value": "<div class='test-class'>test</div>"
                },
                {
                    "key": "Test Link",
                    "value": "<a href='#'>This is Link to some Report</a>"
                },
                {
                    "key": "Test Script",
                    "value": "<script>console.log('testing')</script>"
                },
                {
                    "key": "Test link with onclick",
                    "value": "<a href='#' onclick='alert(\"test\")'>click me</a>"
                },
                {
                    "key": "Test Links but field_type text",
                    "value": "<a href='#'>This is Link to some Report</a>"
                }
            ],
            category: {
                name: "Test Category",
                configuration: {
                    field_type: {
                        "Test allowed Tag": "html",
                        "Test unallowed Tag": "html",
                        "Test Unordered List": "html",
                        "Test Custom Style Attr": "html",
                        "Test Class Attr": "html",
                        "Test Link": "html",
                        "Test Script": "html",
                        "Test link with onclick": "html"
                    }
                }
            },
            theme: {
                name: "Test Theme",
            }
        };
    }
}


export class TestMapControlConfigData {
    constructor() {
        this.mapControlConfig = {
            map: {
                choropleth: {
                    colors: ["#fef0d9", "#fdcc8a", "#fc8d59", "#e34a33", "#b30000"],
                    opacity: 0.7,
                    opacity_over: 0.8
                },
                defaultCoordinates: {
                    lat: 23.06241,
                    long: -28.33792,
                    zoom: 6
                },
                tileLayers: [
                    {
                        url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}.png",
                        pane: "tilePane",
                        zIndex: 200
                    },
                    {
                        url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}.png",
                        pane: "labelsPanel",
                        zIndex: 350
                    }
                ],
                zoomEnabled: false,
                zoomPosition: "bottomright",
                leafletOptions: {
                    preferCanvas: true,
                    zoomControl: false
                }
            }
        };
    }
}
