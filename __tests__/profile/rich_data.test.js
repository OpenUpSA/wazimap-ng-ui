import {screen, fireEvent, getByText} from '@testing-library/dom'

import {Category} from "../../src/js/profile/category.js";
import {Component} from '../../src/js/utils';

import html from '../../src/index.html';

describe('Rich data panel tests', () => {
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
                            "age": "1"
                        }],
                        "content_type": "indicator",
                        "metadata": {},
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
    let category = new Category(component, formattingConfig, categoryName, categoryDetail, profileWrapper, id, removePrevCategories, isFirst)

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
        new Category(component, {}, 'Test category', categoryDetail, profileWrapper, id, removePrevCategories, isFirst);

        let descEle = document.querySelector('.sub-category-header__description');
        let descText = document.querySelector('.sub-category-header__description p');

        expect(descEle).toHaveClass('hidden');
        expect(descText).toBeEmptyDOMElement();
    })

    test('Descriptions are displayed correctly', () => {
        categoryDetail.subcategories['Mock subcategory'].description= 'test description';

        new Category(component, {}, 'Test category', categoryDetail, profileWrapper, id, removePrevCategories, isFirst);

        let descEle = document.querySelector('.sub-category-header__description');
        let descText = document.querySelector('.sub-category-header__description p');

        expect(descEle).not.toHaveClass('hidden');
        expect(descText).toContainHTML('test description');
    })
})