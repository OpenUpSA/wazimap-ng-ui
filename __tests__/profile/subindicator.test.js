import {SubindicatorFilter} from "../../src/js/profile/subindicator_filter";
import {screen, fireEvent, getByText} from '@testing-library/dom'

const DATA = [
    {"race": "Race1", "count": 35, "gender": "Female"},
    {"race": "Race1", "count": 30, "gender": "Male"},
    {"race": "Race2", "count": 60, "gender": "Male"},
]
const CHILD_DATA = {
    "Geography1": [
        {"race": "Race1", "count": 15, "gender": "Female"},
        {"race": "Race1", "count": 20, "gender": "Male"},
        {"race": "Race2", "count": 30, "gender": "Male"},
    ],
    "Geography2": [
        {"race": "Race1", "count": 20, "gender": "Female"},
        {"race": "Race1", "count": 10, "gender": "Male"},
        {"race": "Race2", "count": 30, "gender": "Male"},
    ]
}
const GROUPS = [
    {subindicators: ["Male", "Female"], name: "gender",},
    {subindicators: ["Race1", "Race2"], name: "race",}
];

describe('SubindicatorFilter', () => {
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
        applyFilter = jest.fn();
        si = new SubindicatorFilter(filterArea, GROUPS, title, applyFilter, dropdowns, [], CHILD_DATA, true);
    })


    test.each([
        [{filterGroup: GROUPS[0], filter: "Male"}, 2],
        [{filterGroup: GROUPS[1], filter: "Race2"}, 1],
    ])('Extract groups correctly', (value, expected) => {
        $(si.allDropdowns[0]).find('.dropdown-menu__selected-item .truncate').text(value.filterGroup.name);
        $(si.allDropdowns[1]).find('.dropdown-menu__selected-item .truncate').text(value.filter);

        const chartData = si.getFilteredGroups(value.filter)

        expect(chartData["Geography1"].length).toBe(expected);
    })

    test('Handles missing group correctly', () => {
        $(si.allDropdowns[0]).find('.dropdown-menu__selected-item .truncate').text('XXXXXX');
        $(si.allDropdowns[1]).find('.dropdown-menu__selected-item .truncate').text('Male');
        const chartData = si.getFilteredGroups()

        expect(chartData["Geography1"].length).toBe(0)
    })

    test('Handles missing subindicator correctly', () => {
        $(si.allDropdowns[0]).find('.dropdown-menu__selected-item .truncate').text('gender');
        $(si.allDropdowns[1]).find('.dropdown-menu__selected-item .truncate').text('XXXXXX');
        const chartData = si.getFilteredGroups()

        expect(chartData["Geography1"].length).toBe(0)
    })

    describe('#getFilteredData', () => {
        test('all values returns the defaults', () => {
            $(si.allDropdowns[0]).find('.dropdown-menu__selected-item .truncate').text('All values');
            $(si.allDropdowns[1]).find('.dropdown-menu__selected-item .truncate').text('All values');
            let chartData = si.getFilteredData()

            expect(chartData).toStrictEqual(CHILD_DATA);
        });

        test('group filter returns the subindcator values', () => {

            $(si.allDropdowns[0]).find('.dropdown-menu__selected-item .truncate').text('gender');
            $(si.allDropdowns[1]).find('.dropdown-menu__selected-item .truncate').text('Female');
            let chartData = si.getFilteredData()

            expect(chartData["Geography1"].length).toBe(1);
            expect(chartData["Geography1"][0]["gender"]).toBe("Female");

            expect(chartData["Geography2"].length).toBe(1);
            expect(chartData["Geography2"][0]["gender"]).toBe("Female");
        })
    })
    describe('UI interactions', () => {
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
})
