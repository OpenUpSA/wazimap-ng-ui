import {SubindicatorFilter} from "../../src/js/profile/subindicator_filter";
import { screen, fireEvent, getByText } from '@testing-library/dom'

const indicators = {
    'Age by race': {
        'groups': {
            'gender': {
                'Female': {'subindicator1': {'count': 10}, 'subindicator2': {'count': 20}},
                'Male': {'subindicator1': {'count': 30}, 'subindicator2': {'count': 40}},
            },
            'race': {
                'Race1': {'subindicator1': {'count': 50}, 'subindicator2': {'count': 60}},
                'Race2': {'subindicator1': {'count': 70}, 'subindicator2': {'count': 80}},
            },
        },
        'subindicators': [
            {label: 'subindicator1', "count": 90},
            {label: 'subindicator2', "count": 100},
        ]
    },
    'Another indicator': {}
}

function testChartData(chartData, expectedData) {
    expect(chartData[0].value).toBe(expectedData[0].value);
    expect(chartData[0].label).toBe(expectedData[0].label);
    expect(chartData[1].value).toBe(expectedData[1].value);
    expect(chartData[1].label).toBe(expectedData[1].label);
}

describe('Testing Subindicator Filter', () => {
  let si;
  const title = 'Age by race';
  let applyFilter;
  beforeEach(() => {
    // probably better to read the index.html file and include it here
    document.body.innerHTML = `
      <div class="mapping-options__filter">
        <div class="mapping-options__filter_label">
          <div>Select a value:</div>
        </div>
        <div data-testid="group-by" data-w-id="c3edb6cb-8fc8-3508-f112-94613483dd79" class="mapping-options__filter_menu">
          <div class="dropdown-menu__trigger narrow">
            <div class="dropdown-menu__selected-item">
              <div class="truncate">All values</div>
            </div>
            <div class="dropdown-menu__icon">
              <div class="svg-icon w-embed"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewbox="0 0 24 24">
                  <path d="M0 0h24v24H0z" fill="none"></path>
                  <path fill="currentColor" d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"></path>
                </svg></div>
            </div>
          </div>
          <div class="dropdown-menu__content position-top scroll-element">
            <div class="dropdown__list_item selected">
              <div class="truncate">All values</div>
            </div>
            <div class="dropdown__list_item">
              <div class="truncate">Value</div>
            </div>
          </div>
        </div>
      </div>
      <div class="mapping-options__filter disabled">
        <div class="mapping-options__filter_label">
          <div>FILTER BY:</div>
        </div>
        <div data-w-id="fd26a4e0-f0f7-aaf0-9eee-32c6e9fb2e19" class="mapping-options__filter_menu">
          <div class="dropdown-menu__trigger narrow">
            <div class="dropdown-menu__selected-item">
              <div class="truncate">All filters</div>
            </div>
            <div class="dropdown-menu__icon">
              <div class="svg-icon w-embed"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewbox="0 0 24 24">
                  <path d="M0 0h24v24H0z" fill="none"></path>
                  <path fill="currentColor" d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"></path>
                </svg></div>
            </div>
          </div>
          <div class="dropdown-menu__content position-top scroll-element">
            <div class="dropdown__list_item selected">
              <div class="truncate">All Filters</div>
            </div>
            <div class="dropdown__list_item">
              <div class="truncate">Filter</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    `;
    let dropdowns = $(document).find('.mapping-options__filter');
    const filterArea = $(document).find('.map-options__filters_content');
    let groups = ['race', 'gender']
    applyFilter = jest.fn();
    let parent = { applyFilter };
    si = new SubindicatorFilter(indicators, filterArea, groups, title, parent, dropdowns, []);
  })


    test.each([
        [{group: 'race', subindicator: 'Race2'}, indicators[title].groups.race.Race2],
        [{group: 'gender', subindicator: 'Female'}, indicators[title].groups.gender.Female],
    ])('Extract groups correctly', (value, expected) => {
        const chartData = si.getFilteredGroups(indicators[title].groups, value.group, value.subindicator)
        testChartData(chartData, [
            {label: 'subindicator1', value: expected.subindicator1.count},
            {label: 'subindicator2', value: expected.subindicator2.count},
        ])
    })

    test('Handles missing group correctly', () => {
        const chartData = si.getFilteredGroups(indicators[title].groups, 'Missing group', 'XXXXXX')
        expect(chartData.length).toBe(0)
    })

    test('Handles missing subindicator correctly', () => {
        const chartData = si.getFilteredGroups(indicators[title].groups, 'Gender', 'Missing subindicator')
        expect(chartData.length).toBe(0)
    })

    test('Extracts subindicators correctly', () => {
        const subindicators = si.getFilteredSubindicators(indicators[title].subindicators)
        testChartData(subindicators, [
            {label: 'subindicator1', value: 90},
            {label: 'subindicator2', value: 100}
        ])
    })

    test('Filters correctly', () => {
        let chartData = si.getFilteredData('All values', '', title)
        testChartData(chartData, [
            {label: 'subindicator1', value: 90},
            {label: 'subindicator2', value: 100}
        ])

        chartData = si.getFilteredData('Female', 'gender', title)
        testChartData(chartData, [
            {label: 'subindicator1', value: 10},
            {label: 'subindicator2', value: 20}
        ])

    })
  test('select subcategory', () => {
    fireEvent.click(screen.getByText('race').parentNode);

    expect(screen.getByText('Race1')).toBeVisible();
    expect(applyFilter).toHaveBeenCalled();
  });

  describe('returning to all values', () => {
    beforeEach(() => {
      // set the group values first to be "race"
      fireEvent.click(screen.getByText('race').parentNode);
    })
    test('should reset the filter dropdown', () => {
      let groupDropdowns = screen.getByTestId('group-by');
      fireEvent.click(getByText(groupDropdowns, 'All values').parentNode);

      expect(screen.queryByText('Race1')).not.toBeInTheDocument();
    });

    test('should call parent filter twice', () => {
      let groupDropdowns = screen.getByTestId('group-by');
      fireEvent.click(getByText(groupDropdowns, 'All values').parentNode);

      expect(applyFilter).toHaveBeenCalled();
    });
  })
})
