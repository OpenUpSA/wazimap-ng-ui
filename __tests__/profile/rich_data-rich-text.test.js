import {screen, fireEvent, getByText} from '@testing-library/dom'

import { Category } from "../../src/js/profile/category.js";
import {Component} from '../../src/js/utils';

import html from '../../src/index.html';

describe('Rich data panel HTML indicator test', () => {
    document.body.innerHTML = html;

    const formattingConfig = {}
    const profileWrapperClass = '.rich-data-content';
    const categoryName = "Test category";
    const categoryDetail = {
        "description": "mock category description",
        "subcategories": {
            "Mock subcategory": {
                "description": "mock subcategory description",
                "indicators": {
                    "Mock indicator": {
                        "data": [{contents: "<b>bold stuff</b>"}, {contents: "<em>emphasised stuf</em>"}],
                        "content_type": "html",
                        "dataset_content_type": "qualitative",
                        "metadata": {},
                        "groups": [],
                        "description": "mock indicator description",
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

    test('HTML content is shown', () => {
      checkContent(
        '.profile-indicator__chart_body',
        '<div><b>bold stuff</b></div><div><em>emphasised stuf</em></div>'
      )
    })


    test('Category description is visible and renders HTML tags', () => {
        checkContent('.category-header__description', '<p>mock category description</p>');
    })

    test('Subcategory description is visible and renders HTML tags', () => {
        checkContent('.sub-category-header__description', '<p>mock subcategory description</p>');
    })

    test('Indicator description is visible and renders HTML tags', () => {
        checkContent('.profile-indicator__chart_description', '<p>mock indicator description</p>');
    })

    function checkContent(elementClass, description) {
        let element = document.querySelector(elementClass);
        expect(element).toBeVisible();
      expect(element.innerHTML.trim()).toBe(description);
    }
})
