import {Category} from "../../src/js/profile/category.js";
import {Component} from '../../src/js/utils';

import html from '../../src/index.html';
import {TestData} from "../../src/js/test_data";

describe('Rich data panel tests', () => {
    beforeEach(() => {
        document.body.innerHTML = html;
        const formattingConfig = {}
        const profileWrapperClass = '.rich-data-content';
        const categoryName = "Test category";
        const categoryDetail = {
            "description": "<p>A <strong>category</strong> description</p>",
            "subcategories": {
                "Mock subcategory": {
                    "description": "<p>A <strong>subcategory</strong> description</p>",
                    "indicators": {
                        "Mock indicator": {
                            "data": [{
                                "age": "1",
                                "count": "50"
                            }],
                            "content_type": "indicator",
                            "metadata": {
                                "groups": [{
                                    "subindicators": [
                                        "30-35",
                                        "20-24",
                                        "15-24 (Intl)",
                                        "15-35 (ZA)",
                                        "15-19",
                                        "25-29"
                                    ],
                                    "dataset": 96,
                                    "name": "age",
                                    "can_aggregate": true,
                                    "can_filter": true
                                },],
                                "primary_group": "age",
                            },
                            "dataset_content_type": "quantitative",
                            "chartConfiguration": {
                                "types": {
                                    "Value": {
                                        "formatting": ",.0f"
                                    },
                                    "Percentage": {
                                        "formatting": ".0%",
                                        "maxX": 1,
                                        "minX": 0
                                    }
                                },
                                "defaultType": "Percentage",
                                "xTicks": 6
                            },
                            "groups": [],
                            "description": "<p>An <strong>indicator</strong> description</p>",
                            "type": "indicator",
                            "version_data": {
                                "model": {
                                    "isActive": true
                                }
                            }
                        }
                    }
                }
            }
        };

        const profileWrapper = $(profileWrapperClass);
        const id = "category-1";
        const removePrevCategories = true;
        const isFirst = true;
        let component = new Component();
        let category = new Category(component, formattingConfig, categoryName, categoryDetail, profileWrapper, id, removePrevCategories, isFirst, null, {'chart_attribution': 'test attribution'}, false)
    });

    test('Category description is visible and renders HTML tags', () => {
        checkHTMLIsRendered('.category-header__description', 'A category description');
    })

    test('Subcategory description is visible and renders HTML tags', () => {
        checkHTMLIsRendered('.sub-category-header__description', 'A subcategory description');
    })

    test('Indicator description is visible and renders HTML tags', () => {
        checkHTMLIsRendered('.profile-indicator__chart_description', 'An indicator description');
    })

    test('Chart download is visible', () => {
        let chartDownload = document.querySelector('.content__item_title');
        expect(chartDownload).toBeVisible();
    })

    function checkHTMLIsRendered(elementClass, description) {
        let descriptionElement = document.querySelector(elementClass);
        let htmlTag = descriptionElement.textContent.trim();
        expect(descriptionElement).toBeVisible();
        expect(descriptionElement.innerHTML).toContain("<strong>");
        expect(htmlTag).toBe(description)
    }
})

describe('Rich data panel', () => {
    let component;
    let profileWrapper;
    let id;
    let removePrevCategories;
    let isFirst;
    let categoryDetail;
    beforeEach(() => {
        document.body.innerHTML = html;
        categoryDetail = {
            "description": "",
            "subcategories": {
                "Mock subcategory": {
                    "description": "",
                    "indicators": {
                        "Mock indicator": {}
                    }
                }
            }
        }

        component = new Component();
        profileWrapper = $('.rich-data-content');
        id = "category-1";
        removePrevCategories = true;
        isFirst = true;
    })

    test('Empty descriptions are hidden and empty', () => {
        new Category(component, {}, 'Test category', categoryDetail, profileWrapper, id, removePrevCategories, isFirst, null, {'chart_attribution': 'test attribution'});

        let descEle = document.querySelector('.sub-category-header__description');
        let descText = document.querySelector('.sub-category-header__description p');

        expect(descEle).toHaveClass('hidden');
        expect(descText).toBeEmptyDOMElement();
    })

    test('Descriptions are displayed correctly', () => {
        categoryDetail.subcategories['Mock subcategory'].description = 'test description';

        new Category(component, {}, 'Test category', categoryDetail, profileWrapper, id, removePrevCategories, isFirst, null, {'chart_attribution': 'test attribution'});

        let descEle = document.querySelector('.sub-category-header__description');
        let descText = document.querySelector('.sub-category-header__description p');

        expect(descEle).not.toHaveClass('hidden');
        expect(descText).toContainHTML('test description');
    })
})


describe('Subcategory visibility in rich data panel', () => {
    let categoryDetail;
    let formattingConfig = {}
    const profileWrapperClass = '.rich-data-content';
    const categoryName = "Test category";
    const profileWrapper = $(profileWrapperClass);
    const id = "category-1";
    const removePrevCategories = true;
    const isFirst = true;
    let component = new Component();
    let hiddenIndicators = [];
    let key_metrics = [
      {
        "label": "test-key-metrics",
        "method": "absolute_value",
        "value": 4383173
      }
    ]
    beforeEach(() => {
        document.body.innerHTML = html;
        categoryDetail = {
            "description": "<p>A <strong>category</strong> description</p>",
            "subcategories": {
                "Mock subcategory": {
                    "description": "<p>A <strong>subcategory</strong> description</p>",
                    "order": 1,
                    "indicators": {
                        "Mock indicator": {
                            "id": 1,
                            "data": [{
                                "age": "1",
                                "count": "50"
                            }],
                            "content_type": "indicator",
                            "metadata": {
                                "groups": [{
                                    "subindicators": [
                                        "30-35",
                                        "20-24",
                                        "15-24 (Intl)",
                                        "15-35 (ZA)",
                                        "15-19",
                                        "25-29"
                                    ],
                                    "dataset": 96,
                                    "name": "age",
                                    "can_aggregate": true,
                                    "can_filter": true
                                },],
                                "primary_group": "age",
                            },
                            "dataset_content_type": "quantitative",
                            "chartConfiguration": {
                                "types": {
                                    "Value": {
                                        "formatting": ",.0f"
                                    },
                                    "Percentage": {
                                        "formatting": ".0%",
                                        "maxX": 1,
                                        "minX": 0
                                    }
                                },
                                "defaultType": "Percentage",
                                "xTicks": 6
                            },
                            "groups": [],
                            "description": "<p>An <strong>indicator</strong> description</p>",
                            "type": "indicator",
                            "version_data": {
                                "model": {
                                    "isActive": true
                                }
                            }
                        }
                    }
                }
            }
        };
    });

    test('Subcategory is visible if valid indicator exists', () => {
      let category = new Category(
          component, formattingConfig, categoryName, categoryDetail, profileWrapper,
          id, removePrevCategories, isFirst, null, {'chart_attribution': 'test attribution'},
          false, {}, [], hiddenIndicators
      )
      expect(category.subCategories.length).toBe(1);
      expect(category.subCategories[0].isVisible).toBe(true);
      expect(category.subCategories[0].indicators.length).toBe(1);
    })

    test('Subcategory not visible if subcategory does not have indicators', () => {
      categoryDetail["subcategories"]["Mock subcategory"]["indicators"] = {}
      let category = new Category(
          component, formattingConfig, categoryName, categoryDetail, profileWrapper,
          id, removePrevCategories, isFirst, null, {'chart_attribution': 'test attribution'},
          false, {}, [], hiddenIndicators
      )
      expect(category.subCategories.length).toBe(0);
    })

    test('Subcategory not visible if indicators are present but hidden by hiddenIndicators', () => {
      hiddenIndicators = [1]
      let category = new Category(
          component, formattingConfig, categoryName, categoryDetail, profileWrapper,
          id, removePrevCategories, isFirst, null, {'chart_attribution': 'test attribution'},
          false, {}, [], hiddenIndicators
      )
      expect(category.subCategories.length).toBe(1);
      expect(category.subCategories[0].isVisible).toBe(false);
      expect(category.subCategories[0].indicators.length).toBe(1);
      expect(category.subCategories[0].indicators[0].isVisible).toBe(false);
    })

    test('Subcategory visible if indicators are not present but there is a key metric', () => {
      categoryDetail["subcategories"]["Mock subcategory"]["indicators"] = {};
      categoryDetail["subcategories"]["Mock subcategory"]["key_metrics"] = key_metrics;
      formattingConfig = {
        integer: ",",
        percentage: ".2%"
      }

      let category = new Category(
          component, formattingConfig, categoryName, categoryDetail, profileWrapper,
          id, removePrevCategories, isFirst, null, {'chart_attribution': 'test attribution'},
          false, {}, [], hiddenIndicators
      )
      expect(category.subCategories.length).toBe(1);
      expect(category.subCategories[0].isVisible).toBe(true);
      expect(category.subCategories[0].hasKeyMetrics).toBe(true);
      expect(category.subCategories[0].indicators.length).toBe(0);
    })

    test('Subcategory visible if indicators present but hidden and there is a key metric', () => {
      hiddenIndicators = [1]
      categoryDetail["subcategories"]["Mock subcategory"]["key_metrics"] = key_metrics;
      formattingConfig = {
        integer: ",",
        percentage: ".2%"
      }

      let category = new Category(
          component, formattingConfig, categoryName, categoryDetail, profileWrapper,
          id, removePrevCategories, isFirst, null, {'chart_attribution': 'test attribution'},
          false, {}, [], hiddenIndicators
      )
      expect(category.subCategories.length).toBe(1);
      expect(category.subCategories[0].isVisible).toBe(true);
      expect(category.subCategories[0].hasKeyMetrics).toBe(true);
      expect(category.subCategories[0].indicators.length).toBe(1);
      expect(category.subCategories[0].indicators[0].isVisible).toBe(false);
    })

    test('Subcategory is set to hidden when indicator is hidden using hiddenIndicators', () => {
      let category = new Category(
          component, formattingConfig, categoryName, categoryDetail, profileWrapper,
          id, removePrevCategories, isFirst, null, {'chart_attribution': 'test attribution'},
          false, {}, [], []
      )
      expect(category.subCategories.length).toBe(1);
      expect(category.subCategories[0].isVisible).toBe(true);
      expect(category.subCategories[0].hasKeyMetrics).toBe(false);
      expect(category.subCategories[0].indicators.length).toBe(1);
      expect(category.subCategories[0].indicators[0].isVisible).toBe(true);
      let indicator = category.subCategories[0].indicators[0];

      // set indicator to isVisible false
      indicator.isVisible = false;

      expect(category.subCategories.length).toBe(1);
      expect(category.subCategories[0].isVisible).toBe(false);
      expect(category.subCategories[0].hasKeyMetrics).toBe(false);
      expect(category.subCategories[0].indicators.length).toBe(1);
      expect(category.subCategories[0].indicators[0].isVisible).toBe(false);
    })

    test('Subcategory is not set to hidden when indicator is hidden using hiddenIndicators but there is a key metric available', () => {
      categoryDetail["subcategories"]["Mock subcategory"]["key_metrics"] = key_metrics;
      formattingConfig = {
        integer: ",",
        percentage: ".2%"
      }
      let category = new Category(
          component, formattingConfig, categoryName, categoryDetail, profileWrapper,
          id, removePrevCategories, isFirst, null, {'chart_attribution': 'test attribution'},
          false, {}, [], []
      )
      expect(category.subCategories.length).toBe(1);
      expect(category.subCategories[0].isVisible).toBe(true);
      expect(category.subCategories[0].hasKeyMetrics).toBe(true);
      expect(category.subCategories[0].indicators.length).toBe(1);
      expect(category.subCategories[0].indicators[0].isVisible).toBe(true);
      let indicator = category.subCategories[0].indicators[0];

      // set indicator to isVisible false
      indicator.isVisible = false;

      expect(category.subCategories.length).toBe(1);
      expect(category.subCategories[0].isVisible).toBe(true);
      expect(category.subCategories[0].hasKeyMetrics).toBe(true);
      expect(category.subCategories[0].indicators.length).toBe(1);
      expect(category.subCategories[0].indicators[0].isVisible).toBe(false);
    })
})
