import SubindicatorCalculator from '../src/js/map/choropleth/subindicator_calculator';

const CHILD_DATA = {
    EC: [{
        age: "15-19",
        race: "Black african",
        count: "3599.3753699998",
        gender: "Female",
        language: "Afrikaans"
    },
        {
            age: "15-19",
            race: "Black african",
            count: "8665.81757999899",
            gender: "Female",
            language: "English"
        }],
    FS: [{
        age: "15-19",
        race: "Black african",
        count: "3379.2461000001",
        gender: "Female",
        language: "Afrikaans"
    },
        {
            age: "15-19",
            race: "Black african",
            count: "2877.36439000009",
            gender: "Female",
            language: "English"
        }]
};
let PRIMARY_GROUP = "age";
let SELECTED_SUBINDICATOR = "15-19";

describe('SubindicatorCalculator', () => {

    describe('#calculate', () => {
        describe('all geography codes in both', () => {
            it('calculates percentage', () => {
                let expectedResult = [{code: "EC", val: 1, total: 12265.19294999879}, {
                    code: "FS",
                    val: 1,
                    total: 6256.61049000019
                }];
                let bt = new SubindicatorCalculator();

                let result = bt.calculate(CHILD_DATA, PRIMARY_GROUP, SELECTED_SUBINDICATOR);

                expect(result).toEqual(expectedResult)

            });
        });
    });
});

