import {defaults as d} from '../src/js/defaults';

describe('Testing defaults', () => {
  test('checkAny function works correctly', () => {
    expect(d.checkAny(5, 5)).toBe(5);
    expect(d.checkAny('XXX', 5)).toBe('XXX');
    expect(d.checkAny(undefined, 5)).toBe(5);
    expect(d.checkAny(null, 5)).toBe(5);
    expect(d.checkAny({}, 5)).toBe(5);
    expect(d.checkAny('', 5)).toBe(5);
  }) 
})

