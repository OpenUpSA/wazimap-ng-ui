import {Chart} from "../../src/js/profile/chart";
import {screen} from "@testing-library/dom";
import {Component} from '../../src/js/utils';

const PERCENTAGE_TYPE = "percentage";
const VALUE_TYPE = "value";
const indicatorClass = '.profile-indicator';


describe('default value filters', () => {
    let c;
    let mockIndicator = {
        "metadata": {
            "primary_group": "age",
            "groups": [
                {
                    "subindicators": [
                        "Language"
                    ],
                    "dataset": 100,
                    "name": "language",
                    "can_aggregate": true,
                    "can_filter": true
                }
            ]
        },
        "data": [
            {
                "age": "1",
                "race": "Race",
                "count": "10",
                "gender": "Female",
                "language": "Language"
            }
        ],
        "chartConfiguration": {
            "types": {
                "Value": {
                    "formatting": ",.0f",
                    "minX": "default",
                    "maxX": "default"
                },
                "Percentage": {
                    "formatting": ".0%",
                    "minX": 0,
                    "maxX": 1
                }
            },
            "disableToggle": true,
            "defaultType": "Value"
        }
    };

    beforeEach(async () => {
        document.body.innerHTML = `<div class="profile-indicator last">
                <div class="profile-indicator__header">
                  <div class="profile-indicator__title">
                    <h4>Indicator chart title</h4>
                  </div>
                  <div class="profile-indicator__options">
                    <div class="hover-menu">
                      <div class="hover-menu__icon">
                        <div class="svg-icon w-embed"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewbox="0 0 24 24">
                            <path fill="currentColor" d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path>
                          </svg></div>
                      </div>
                      <div class="hover-menu__content">
                        <div class="hover-menu__content_wrapper">
                          <a href="#" class="hover-menu__content_item w-inline-block">
                            <div class="icon--small"><img src="https://uploads-ssl.webflow.com/5ea151b3c7c39749f3e09ee7/5ea151b3c7c397204ee09f13_image-24px.svg" alt=""></div>
                            <div class="content__item_title">
                              <div>Save as image</div>
                            </div>
                          </a>
                          <div data-element="chart-value-select" class="hover-menu__chart-value">
                            <div class="hover-menu__content_item--no-link">
                              <div class="icon--small">
                                <div class="svg-icon small w-embed"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewbox="0 0 24 24">
                                    <path d="M0 0h24v24H0z" fill="none"></path>
                                    <path fill="currentColor" d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 10H3V8h2v4h2V8h2v4h2V8h2v4h2V8h2v4h2V8h2v8z"></path>
                                  </svg></div>
                              </div>
                              <div class="content__item_title">
                                <div>Chart values as:</div>
                              </div>
                            </div>
                            <div data-testid="data-toggle" class="hover-menu__content_list">
                              <a data-id="Percentage" href="#" class="hover-menu__content_list-item active w-inline-block">
                                <div>Percentage</div>
                              </a>
                              <a data-id="Value" href="#" class="hover-menu__content_list-item last w-inline-block">
                                <div>Value</div>
                              </a>
                            </div>
                          </div>
                          <div data-element="chart-download-data" class="hover-menu__download-data">
                            <div class="hover-menu__content_item--no-link">
                              <div class="icon--small"><img src="https://uploads-ssl.webflow.com/5ea151b3c7c39749f3e09ee7/5ea151b3c7c3974bdbe09f2e_download-24px.svg" alt=""></div>
                              <div class="content__item_title">
                                <div>Click to download data:</div>
                              </div>
                            </div>
                            <div class="hover-menu__content_list--last">
                              <a data-id="csv" href="#" class="hover-menu__content_list-item w-inline-block">
                                <div>CSV</div>
                              </a>
                              <a data-id="excel" href="#" class="hover-menu__content_list-item w-inline-block">
                                <div>Excel</div>
                              </a>
                              <a data-id="json" href="#" class="hover-menu__content_list-item w-inline-block">
                                <div>JSON</div>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="profile-indicator__filters-wrapper">
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
                <div class="profile-indicator__chart">
                  <div class="profile-indicator__chart_body">
                    <div class="indicator__chart full">
                      <div class="bar-chart">
                        <div class="bar-chart__main">
                          <div class="bar-chart__labels">
                            <div class="bar-chart__label">
                              <div class="bar-chart__label_position">
                                <div class="bar-chart__label_value">
                                  <div>0%</div>
                                </div>
                              </div>
                            </div>
                            <div class="bar-chart__label">
                              <div class="bar-chart__label_position">
                                <div class="bar-chart__label_value">
                                  <div>0%</div>
                                </div>
                              </div>
                            </div>
                            <div class="bar-chart__label">
                              <div class="bar-chart__label_position">
                                <div class="bar-chart__label_value">
                                  <div>0%</div>
                                </div>
                              </div>
                            </div>
                            <div class="bar-chart__label">
                              <div class="bar-chart__label_position">
                                <div class="bar-chart__label_value">
                                  <div>0%</div>
                                </div>
                              </div>
                            </div>
                            <div class="bar-chart__label">
                              <div class="bar-chart__label_position">
                                <div class="bar-chart__label_value">
                                  <div>0%</div>
                                </div>
                              </div>
                            </div>
                            <div class="bar-chart__label">
                              <div class="bar-chart__label_position">
                                <div class="bar-chart__label_value">
                                  <div>0%</div>
                                </div>
                              </div>
                            </div>
                            <div class="bar-chart__label">
                              <div class="bar-chart__label_position">
                                <div class="bar-chart__label_value">
                                  <div>0%</div>
                                </div>
                              </div>
                            </div>
                            <div class="bar-chart__label">
                              <div class="bar-chart__label_position">
                                <div class="bar-chart__label_value">
                                  <div>0%</div>
                                </div>
                              </div>
                            </div>
                            <div class="bar-chart__label">
                              <div class="bar-chart__label_position">
                                <div class="bar-chart__label_value">
                                  <div>0%</div>
                                </div>
                              </div>
                            </div>
                            <div class="bar-chart__label">
                              <div class="bar-chart__label_position">
                                <div class="bar-chart__label_value">
                                  <div>0%</div>
                                </div>
                              </div>
                            </div>
                            <div class="bar-chart__label">
                              <div class="bar-chart__label_position">
                                <div class="bar-chart__label_value">
                                  <div>0%</div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div class="bar-chart__rows">
                            <div class="bar-chart__row">
                              <div class="bar-chart__row_label">
                                <div class="truncate">Truncation of the following sentence</div>
                              </div>
                              <div class="bar-chart__row-wrapper">
                                <div class="bar-chart__row_bar _1">
                                  <div class="bar-chart__row_tooltip">
                                    <div class="bar-chart__row_tooltip-card">
                                      <div class="bar-chart__tooltip_name">
                                        <div>Long chart label looks like this</div>
                                      </div>
                                      <div class="bar-chart__tooltip_value">
                                        <div>00%</div>
                                      </div>
                                      <div class="bar-chart__tooltip_alt-value">
                                        <div>000,000,000</div>
                                      </div>
                                      <div class="bar-chart__row_tooltip-notch"></div>
                                    </div>
                                  </div>
                                </div>
                                <div class="bar-chart__row_value">
                                  <div class="truncate">00%</div>
                                </div>
                              </div>
                            </div>
                            <div class="bar-chart__underline"></div>
                          </div>
                        </div>
                        <div class="bar-chart__x-label">
                          <div>Label Goes here</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="profile-indicator__chart_footer">
                    <div class="profile-indicator__chart_description">
                      <p>Sub-indicator chart footnote goes here and helps to describe the data presented</p>
                    </div>
                    <div class="profile-indicator__chart_source">
                      <div class="chart__footer_label">
                        <div>Source:</div>
                      </div>
                      <div class="data-source">
                        <div>Data source name</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>`;

        const configuration = mockIndicator.chartConfiguration;
        let indicatorData = mockIndicator;
        let groups = [];
        let indicatorNode = $(document).find(indicatorClass);
        let title = '';

        let component = new Component();
        c = new Chart(component, configuration, indicatorData, groups, indicatorNode, title);
        await new Promise(resolve => setTimeout(resolve, 200))
    })

    test('variables are set by config', () => {
        expect(c.config.disableToggle).toBeTruthy();
        expect(c.config.defaultType).toBe("Value");
    })

    test('data toggle respects config', () => {
        let toggle = screen.getByTestId('data-toggle');
        expect(toggle).toHaveClass('hidden');
    })

    test('table and toggle respects config', () => {
        let table = screen.getAllByText('Percentage');
        expect(table).toHaveLength(1);
    })
})

