import {validation, defaultIfMissing} from '../src/js/utils';

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

