import {validation, defaultIfMissing, fillMissingKeys, calculateMidColor} from '../src/js/utils';

describe('Testing validation functions', () => {


    test.each([
        [null, true], [undefined, false], [{}, false],
        ['', false], [NaN, false]])('.isNull(%s)', (value, expected) => {
        expect(validation.isNull(value)).toBe(expected);
    });

    test.each([
        [null, false], [undefined, true], [{}, false],
        ['', false], [NaN, false]])('.isUndefined(%s)', (value, expected) => {
        expect(validation.isUndefined(value)).toBe(expected);
    });

    test.each([
        [null, false], [undefined, false], [{}, false],
        ['', true], [NaN, false]])('.isEmptyString(%s)', (value, expected) => {
        expect(validation.isEmptyString(value)).toBe(expected);
    });

    test.each([
        [null, false], [undefined, false], [{}, true],
        ['', false], [NaN, false]])('.isEmptyObject(%s)', (value, expected) => {
        expect(validation.isEmptyObject(value)).toBe(expected);
    });

    test.each([
        [null, true], [undefined, true], [{}, true],
        ['', true], [5, false]])('.isMissingData(%s)', (value, expected) => {
        expect(validation.isMissingData(value)).toBe(expected);
    });
});

describe('Testing defaults', () => {
    test('checkAny function works correctly', () => {
        expect(defaultIfMissing(5, 5)).toBe(5);
        expect(defaultIfMissing('XXX', 5)).toBe('XXX');
        expect(defaultIfMissing(undefined, 5)).toBe(5);
        expect(defaultIfMissing(null, 5)).toBe(5);
        expect(defaultIfMissing({}, 5)).toBe(5);
        expect(defaultIfMissing('', 5)).toBe(5);
    })
})

describe('Test missing keys', () => {
    test('check that missing keys are filled from defaults', () => {
        const myObject = {first: 1, second: 2, fourth: 4}
        const defaultObject = {first: 3, second: 4, third: 5}
        const filledObject = fillMissingKeys(myObject, defaultObject)

        expect(filledObject.first).toBe(1)
        expect(filledObject.second).toBe(2)
        expect(filledObject.third).toBe(5)
        expect(filledObject.fourth).toBe(4)
    })

    test('check that fillMissingKeys works with empty objects', () => {
        const myObject = {}
        const defaultObject = {first: 1, second: 2}
        const filledObject = fillMissingKeys(myObject, defaultObject)

        expect(filledObject.first).toBe(1)
        expect(filledObject.second).toBe(2)

        const myObject2 = {first: 1, second: 2}
        const defaultObject2 = {}
        const filledObject2 = fillMissingKeys(myObject2, defaultObject2)

        expect(filledObject2.first).toBe(1)
        expect(filledObject2.second).toBe(2)

    })

    test('check that fillMissingKeys works on a copy', () => {
        const myObject = {}
        const defaultObject = {first: 1, second: 2}
        const filledObject = fillMissingKeys(myObject, defaultObject)

        expect(myObject.first).toBe(undefined)
        expect(myObject.second).toBe(undefined)
    })

    test('check that fillMissingKeys supports nested objects', () => {
        let myObject = {}
        let defaultObject = {first: 1, second: {second_1: 2, second_2: 3}}
        let filledObject = fillMissingKeys(myObject, defaultObject)
        const deep_copy = true

        expect(filledObject.first).toBe(1)
        expect(filledObject.second.second_1).toBe(2)
        expect(filledObject.second.second_2).toBe(3)

        myObject = {second: {second_1: 4}}
        defaultObject = {first: 1, second: {second_1: 2, second_2: 3}}
        filledObject = fillMissingKeys(myObject, defaultObject, deep_copy)

        expect(filledObject.first).toBe(1)
        expect(filledObject.second.second_1).toBe(4)
        expect(filledObject.second.second_2).toBe(3)

        myObject = {
            second: {
                second_1: 4,
                second_2: {
                    second_2_1: 5
                }
            }
        }
        defaultObject = {first: 1, second: {second_1: 2, second_2: 3}}
        filledObject = fillMissingKeys(myObject, defaultObject, deep_copy)

        expect(filledObject.first).toBe(1)
        expect(filledObject.second.second_1).toBe(4)
        expect(filledObject.second.second_2.second_2_1).toBe(5)
    })

    test('check that theme background color is calculated correctly', () => {
        let bgColor = calculateMidColor('#EB4034');

        expect(bgColor).toBe('#ff39e833');
    })
})

