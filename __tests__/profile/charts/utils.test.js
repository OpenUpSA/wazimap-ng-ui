import { createFiltersForGroups } from '../../../src/js/profile/charts/utils';

describe('#createFiltersForGroups', () => {
  let groups;
  beforeEach(() => {
    groups = [
      {
        name: 'age'
      }
    ]
  });
  it('returns 2 signals for each group', () => {
    let { signals, filters } = createFiltersForGroups(groups);

    expect(signals.length).toBe(2)
  });
  it('has a filter and a filter value signal', () => {
    let { signals, filters } = createFiltersForGroups(groups);
    let [filter, filterValue] = signals;

    expect(filter.name).toBe('ageFilter')
    expect(filter.value).toBe(false)
    expect(filterValue.name).toBe('ageFilterValue')
  });
  it('has a corresponding filter for the filter signal', () => {
    let { signals, filters } = createFiltersForGroups(groups);
    let [filter] = filters;

    expect(filter).toHaveProperty('type', 'filter')

  });
  it('', () => {
    let { signals, filters } = createFiltersForGroups(groups);
    let [filter] = filters;

    /**
     * we have multiple filters, so we only check the filterValue if the filter is active
     * when the filter is active we check if the ageFilter is set and the datum has the set value for the key. in our case the key is `age` and the filter is named accordngly. we check if the datum(row) has the selected value from the filter
     * Vega is set out to filter values that return false, only filters that return true will be left in. 
     * 
    **/
    expect(filter).toHaveProperty('expr', '!ageFilter || (ageFilter && datum.age === ageFilterValue)')
  });
});
