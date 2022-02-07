import html from '../../src/index.html';
import Controller from "../../src/js/controller";
import {Config as SAConfig} from "../../src/js/configurations/geography_sa";
import {DataMapperMenu} from "../../src/js/elements/menu";
import {configureDataExplorerEvents} from "../../src/js/setup/dataexplorer";
import {loadMenu} from '../../src/js/elements/menu';
import quantQualBasePayload from './dataexplorer-quant-qual-base-payload.data.js';

describe('Data explorer', () => {
    beforeEach(() => {
        document.body.innerHTML = html;
    })

    test('Handles no data correctly', () => {
        let config = new SAConfig();

        const controller = new Controller(this, null, config, 1);
        const dataMapperMenu = new DataMapperMenu(this);

        configureDataExplorerEvents(controller, dataMapperMenu);

        controller.state = {
            profile: {
                geometries: {
                    children: {}
                }
            }
        }
        controller.triggerEvent("versions.indicators.ready", {});

        let noDataChip = document.querySelector('.data-mapper-content__no-data');
        expect(noDataChip).not.toHaveClass('hidden');
    })

    test('Qualitative indicators are not shown', () => {
        let config = new SAConfig();

        const controller = new Controller(this, null, config, 1);
        const dataMapperMenu = new DataMapperMenu(this);

        configureDataExplorerEvents(controller, dataMapperMenu);
        const payload = JSON.parse(JSON.stringify(quantQualBasePayload));
        payload["Demo category"].subcategories["Demo subcategory"].indicators["Qualitative indicator"].content_type = "html";
        payload["Demo category"].subcategories["Demo subcategory"].indicators["Qualitative indicator"].dataset_content_type = "qualitative";

        controller.triggerEvent("versions.all.loaded", payload);

        let descriptionElement = document.querySelector(".data-category__h3");
        expect(descriptionElement).not.toBeVisible();
    })

    test('Quantitative indicators are shown', () => {
        let config = new SAConfig();

        const controller = new Controller(this, null, config, 1);
        const dataMapperMenu = new DataMapperMenu(this);

        configureDataExplorerEvents(controller, dataMapperMenu);

        const payload = JSON.parse(JSON.stringify(quantQualBasePayload));
        payload["Demo category"].subcategories["Demo subcategory"].indicators["Qualitative indicator"].content_type = "indicator";
        payload["Demo category"].subcategories["Demo subcategory"].indicators["Qualitative indicator"].dataset_content_type = "quantitative";

        controller.state = {
            profile: {
                geometries: {
                    children: {
                        "province": {
                            "type": "FeatureCollection",
                            "features": []
                        }
                    }
                }
            }
        }

        controller.triggerEvent("versions.indicators.ready", payload);

        let descriptionElement = document.querySelector(".data-category__h3");
        expect(descriptionElement).toBeVisible();
    })

    test('Subcategory is not shown if all the indicators are qualitative', () => {
        let config = new SAConfig();

        const controller = new Controller(this, null, config, 1);
        const dataMapperMenu = new DataMapperMenu(this);

        configureDataExplorerEvents(controller, dataMapperMenu);

        const payload = JSON.parse(JSON.stringify(quantQualBasePayload));
        payload["Demo category"].subcategories["Demo subcategory"].indicators["Qualitative indicator"].content_type = "html";
        payload["Demo category"].subcategories["Demo subcategory"].indicators["Qualitative indicator"].dataset_content_type = "qualitative";

        controller.state = {
            profile: {
                geometries: {
                    children: {
                        "province": {
                            "type": "FeatureCollection",
                            "features": []
                        }
                    }
                }
            }
        }

        controller.triggerEvent("versions.indicators.ready", payload);

        let subcategoryElement = document.querySelector(".data-category__h2");
        expect(subcategoryElement).not.toBeVisible();
    })

    test('Excluded indicators are not shown', () => {
        let config = new SAConfig();

        const controller = new Controller(this, null, config, 1);
        const dataMapperMenu = new DataMapperMenu(this);

        configureDataExplorerEvents(controller, dataMapperMenu);
        const payload = JSON.parse(JSON.stringify(quantQualBasePayload));
        payload["Demo category"].subcategories["Demo subcategory"].indicators["Qualitative indicator"].chart_configuration = {
            "exclude": ["data mapper"]
        }

        controller.state = {
            profile: {
                geometries: {
                    children: {
                        "province": {
                            "type": "FeatureCollection",
                            "features": []
                        }
                    }
                }
            }
        }

        controller.triggerEvent("versions.indicators.ready", payload);

        let descriptionElement = document.querySelector(".data-category__h3");
        expect(descriptionElement).not.toBeVisible();
    })
})
