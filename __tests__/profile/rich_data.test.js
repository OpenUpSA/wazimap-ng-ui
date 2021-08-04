import {screen, fireEvent, getByText} from '@testing-library/dom'

import { Category } from "../../src/js/profile/category.js";
import {Component} from '../../src/js/utils';

import html from '../../src/index.html';

describe('Rich data panel tests', () => {
    document.body.innerHTML = html;

    const formattingConfig = {}
    const profileWrapperClass = '.rich-data-content';
    const categoryName = "Test category";
    const categoryDetail = {
        "description": "<p>An <strong>HTML</strong> description</p>",
        "subcategories": {
            "Mock subcategory": {
                "description": "<p>A subcategory description</p>",
                "indicators": {
                    "Mock indicator": {
                        "data": [{
                            "age": "1"
                        }],
                        "metadata": {},
                        "groups": {},
                        "description": "<p>An indicator description</p>",
                        "type": "indicator"
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
        checkHTMLIsRendered('.category-header__description', 'An HTML description');
    })

    test('Subcategory description is visible and renders HTML tags', () => {
        checkHTMLIsRendered('.sub-category-header__description', 'A subcategory description');
    })

    test('Indicator description is visible and renders HTML tags', () => {
        checkHTMLIsRendered('.profile-indicator__chart_description', 'An indicator description');
    })

    function checkHTMLIsRendered(elementClass, description) {
        let descriptionElement = document.querySelector(elementClass);
        let htmlTag = descriptionElement.textContent.trim();
        expect(descriptionElement).toBeVisible();
        expect(htmlTag).toBe(description)
    }
})
