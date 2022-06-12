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
            selectedSubindicator: '30-35'
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