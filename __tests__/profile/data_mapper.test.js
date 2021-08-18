import {screen, fireEvent, getByText} from '@testing-library/dom'
import {loadMenu} from '../../src/js/elements/menu';
import {Component} from '../../src/js/utils';
import html from '../../src/index.html';

describe('Data mapper panel tests', () => {
    document.body.innerHTML = html;

    const MenuData = {
        "Demo category": {
            "description": "",
            "subcategories": {
                "Demo subcategory": {
                    "description": "",
                    "indicators": {
                        "Qualitative indicator": {
                            "id": 1,
                            "choropleth_method": "subindicator",
                            "content_type": "html",
                            "dataset_content_type": "qualitative",
                            "data": [
                                {
                                    "content": "Qualitative ZA"
                                }
                            ],
                            "type": "indicator",
                            "groups": []
                        }
                    }
                }
            }
        }
    }

    let menu = loadMenu("", MenuData, "")

    test('Check that qualitative indicators are not populated in the datamapper menu', () => {
        let descriptionElement = document.querySelector(".data-category__h3");
        expect(descriptionElement).not.toBeVisible();
    })
})
