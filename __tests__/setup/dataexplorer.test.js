import html from '../../src/index.html';
import Controller from "../../src/js/controller";
import {Config as SAConfig} from "../../src/js/configurations/geography_sa";
import {DataMapperMenu} from "../../src/js/elements/menu";
import {configureDataExplorerEvents} from "../../src/js/setup/dataexplorer";
import {loadMenu} from '../../src/js/elements/menu';

describe('Data explorer', () => {
    beforeEach(() => {
        document.body.innerHTML = html;
    })

    test('Handles no data correctly', () => {
        let config = new SAConfig();

        const controller = new Controller(this, null, config, 1);
        const dataMapperMenu = new DataMapperMenu(this);

        configureDataExplorerEvents(controller, dataMapperMenu);

        let payload = {
            geometries: {
                children: {}
            }
        }

        controller.triggerEvent("profile.loaded", payload);

        let noDataChip = document.querySelector('.data-mapper-content__no-data');
        expect(noDataChip).not.toHaveClass('hidden');
    })
    
    test('Qualitative indicators are not shown', () => {
        let config = new SAConfig();

        const controller = new Controller(this, null, config, 1);
        const dataMapperMenu = new DataMapperMenu(this);

        configureDataExplorerEvents(controller, dataMapperMenu);

        let payload = {
            geometries: {
                children: {
                    "province": {
                        "type": "FeatureCollection",
                        "features": []
                    }
                }
            },
            profile: {
                profileData: {
                    "Demo category": {
                        "description": "",
                        "subcategories": {
                            "Demo subcategory": {
                                "description": "",
                                "indicators": {
                                    "Qualitative indicator": {
                                        "id": 1,
                                        "description": "",
                                        "choropleth_method": "subindicator",
                                        "metadata": {
                                            "source": null,
                                            "description": null,
                                            "url": null,
                                            "licence": {
                                                "name": null,
                                                "url": null
                                            },
                                            "primary_group": "content",
                                            "groups": [
                                                {
                                                    "subindicators": [
                                                        "Qualitative test EC",
                                                        "Qualitative test ZA"
                                                    ],
                                                    "dataset": 1,
                                                    "name": "content",
                                                    "can_aggregate": true,
                                                    "can_filter": true
                                                }
                                            ]
                                        },
                                        "content_type": "html",
                                        "dataset_content_type": "qualitative",
                                        "data": [
                                            {
                                                "content": "Qualitative test ZA"
                                            }
                                        ],
                                        "child_data": {
                                            "EC": [
                                                {
                                                    "content": "Qualitative test EC"
                                                }
                                            ]
                                        },
                                        "type": "indicator",
                                        "groups": []
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        controller.triggerEvent("profile.loaded", payload);

        let descriptionElement = document.querySelector(".data-category__h3");
        expect(descriptionElement).not.toBeVisible();
    })
})

