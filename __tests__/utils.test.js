import {validation as v} from '../src/js/utils';

const testValues = [null, 5, undefined, {}, '', NaN];
describe('Testing validation', () => {

  test('isNull works correcty', () => {
    const res = testValues.filter(val => v.isNull(val));
    expect(res.length).toBe(1);
    expect(res[0]).toBe(null);
  });

  test('isUndefined works correcty', () => {
    const res = testValues.filter(val => v.isUndefined(val));
    expect(res.length).toBe(1);
    expect(res[0]).toBe(undefined);
  });

  test('isEmptyString works correcty', () => {
    const res = testValues.filter(val => v.isEmptyString(val));
    expect(res.length).toBe(1);
    expect(res[0]).toBe('');
  });

  test('isEmptyObject works correcty', () => {
    const res = testValues.filter(val => v.isEmptyObject(val));
    expect(res.length).toBe(1);
    expect(res[0]).toBe(testValues[3]);
  });

  test('isMissingData works correcty', () => {
    const res = testValues.filter(val => v.isMissingData(val));
    expect(res.length).toBe(4);
    expect(res.indexOf(5)).toBe(-1);
  });
});

