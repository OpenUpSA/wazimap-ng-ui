import {SubindicatorFilter} from "../../src/js/profile/subindicator_filter";
import {screen, fireEvent, getByText} from '@testing-library/dom'
import {Component} from '../../src/js/utils';

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
        document.body.innerHTML = `
    <div class="profile-indicator__filters-wrapper" data-testid="filter-content">
              <div class="profile-indicator__filter-labels">
                <div class="mapping-options__filter">
                  <div class="mapping-options__filter_label">
                    <div>Filter by attribute:</div>
                  </div>
                </div>
                <div class="mapping-options__filter disabled">
                  <div class="mapping-options__filter_label">
                    <div>Select a value:</div>
                  </div>
                </div>
              </div>
              <div class="profile-indicator__filter-row">
                <div class="profile-indicator__filter">
                  <div data-w-id="78932471-3a97-3e48-cc55-679a295ca760" class="profile-indicator__filter_menu">
                    <div class="dropdown-menu__trigger">
                      <div class="dropdown-menu__selected-item">
                        <div class="truncate">Select an attribute</div>
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
                        <div class="truncate">Select an attribute</div>
                      </div>
                      <div class="dropdown__list_item">
                        <div class="truncate">Attribute</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="profile-indicator__filter is--disabled">
                  <div data-w-id="78932471-3a97-3e48-cc55-679a295ca76f" class="profile-indicator__filter_menu">
                    <div class="dropdown-menu__trigger is--disabled">
                      <div class="dropdown-menu__selected-item">
                        <div class="truncate">Select a value</div>
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
                        <div class="truncate">Select a value</div>
                      </div>
                      <div class="dropdown__list_item">
                        <div class="truncate">Value</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="profile-indicator__filter-buttons">
                  <a title="Remove filter" href="#" class="profile-indicator__remove-filter is--hidden w-inline-block">
                    <div class="svg-icon w-embed"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewbox="0 0 24 24">
                        <path d="M0 0h24v24H0z" fill="none"></path>
                        <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
                      </svg></div>
                  </a>
                  <a title="Remove filter" href="#" class="profile-indicator__new-filter w-inline-block">
                    <div class="svg-icon w-embed"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewbox="0 0 24 24">
                        <path d="M0 0h24v24H0z" fill="none"></path>
                        <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path>
                      </svg></div>
                  </a>
                </div>
              </div>
            </div>
    `;
        let dropdowns = $(document).find(`.profile-indicator__filter-row .profile-indicator__filter`);
        const filterArea = $(document).find(".profile-indicator__filters-wrapper");
        applyFilter = jest.fn();
        let component = new Component();
        si = new SubindicatorFilter(component, filterArea, GROUPS, title,  applyFilter, dropdowns, undefined, CHILD_DATA, '.profile-indicator__filter-row');
    })

    test('Does not hide filter area when there are groups to filter by', () => {
        let filterContent = screen.getByTestId('filter-content');
        expect(filterContent.classList.contains('hidden')).toBe(false);
    })

    test('Hides filter area when there are no groups', () => {
        let component = new Component();
        let dropdowns = $(document).find(`.profile-indicator__filter-row .profile-indicator__filter`);
        const filterArea = $(document).find(".profile-indicator__filters-wrapper");
        new SubindicatorFilter(component, filterArea, [], title, applyFilter, dropdowns, undefined, CHILD_DATA, true);

        let filterContent = screen.getByTestId('filter-content');
        expect(filterContent).toHaveClass('hidden');
    })
})
