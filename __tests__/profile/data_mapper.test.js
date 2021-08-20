import {screen, fireEvent, getByText} from '@testing-library/dom'
import Controller from '../../src/js/controller';
import {Component} from '../../src/js/utils';
import html from '../../src/index.html';
import {loadMenu} from '../../src/js/elements/menu';

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

    const config = {
        "config": {
            "urls": [
                "localhost"
            ]
        },
        "api": {
            "eventListeners": {},
            "token": null,
            "baseUrl": "http://127.0.0.1:8000/api/v1",
            "busyLoggingIn": false,
            "failedLogins": 0
        },
        "baseUrl": "http://127.0.0.1:8000",
        "analytics": {
            "timer": {
                "timers": {}
            },
            "profileId": 1
        },
        "profile": 1
    }
    const api = config.api;
    const profileId = 1

    const controller = new Controller(this, api, config, profileId);
    let menu = loadMenu(controller, MenuData, "")

    test('Check that qualitative indicators are not populated in the datamapper menu', () => {
        let descriptionElement = document.querySelector(".data-category__h3");
        expect(descriptionElement).not.toBeVisible();
    })
})
