import {VersionController} from "../../../src/js/versions/version_controller.js";
import {Version} from "../../../src/js/versions/version.js";
import {Component} from '../../../src/js/utils';
import Controller from "../../../src/js/controller";
import {BoundaryTypeBox} from "../../../src/js/map/boundary_type_box.js";

import html from '../../../src/index.html';
import {Config as SAConfig} from "../../../src/js/configurations/geography_sa";


describe('Check Boundary type box options', () => {
    beforeEach(() => {
        document.body.innerHTML = html;
    });
    let config = new SAConfig();

    let versionGeometries = {
        "2011 Boundaries": {
            "children": {
                "mainplace": {
                    "type": "FeatureCollection",
                },
                "ward": {
                    "type": "FeatureCollection",
                }
            },
        },
        "2016 Boundaries": {
            "children": {
                "equal area hexagon": {
                    "type": "FeatureCollection",
                }
            }
        }
    };

    let selectElement = '.map-geo-select';

    let preferredChildren = {
        "district" : ["mainplace", "ward", "equal area hexagon"]
    }

    // version - 2011
    let version1 = new Version("2011 Boundaries", true);
    version1.exists = true;

    // verison - 2016
    let version2 = new Version("2016 Boundaries", true);
    version2.exists = true;

    test('Check Boundary type options for single version', () => {

        const controller = new Controller(this, null, config, 1);
        let versionController = new VersionController(controller, "ZA", true);
        versionController.activeVersion = version1;

        let component = new Component();
        let boundaryTypeBox = new BoundaryTypeBox(component, preferredChildren);

        boundaryTypeBox.activeVersion = version1;
        boundaryTypeBox.populateBoundaryOptions(versionGeometries, "district", [version1])

        // assert options
        let options = document.querySelectorAll(`${selectElement} .dropdown__list_item`);
        expect(options.length).toBe(2);
        expect($(options[0]).text().trim()).toBe("2011 Boundaries / mainplace");
        expect($(options[1]).text().trim()).toBe("2011 Boundaries / ward");

        // assert Selected options
        let selectedOptions = document.querySelectorAll(`${selectElement} .dropdown-menu__selected-item`);
        expect(selectedOptions.length).toBe(1);
        expect($(selectedOptions[0]).text().trim()).toBe("2011 Boundaries / mainplace");
    });

    test('Check Boundary type options for multiple version', () => {
        const controller = new Controller(this, null, config, 1);

        let versionController = new VersionController(controller, "ZA", true);
        versionController.activeVersion = version2;

        let component = new Component();
        let boundaryTypeBox = new BoundaryTypeBox(component, preferredChildren);

        boundaryTypeBox.activeVersion = version2;
        boundaryTypeBox.populateBoundaryOptions(versionGeometries, "district", [version1, version2])

        // assert options
        let options = document.querySelectorAll(`${selectElement} .dropdown__list_item`);
        expect(options.length).toBe(3);
        expect($(options[0]).text().trim()).toBe("2011 Boundaries / mainplace");
        expect($(options[1]).text().trim()).toBe("2011 Boundaries / ward");
        expect($(options[2]).text().trim()).toBe("2016 Boundaries / equal area hexagon");

        // assert Selected options
        let selectedOptions = document.querySelectorAll(`${selectElement} .dropdown-menu__selected-item`);
        expect(selectedOptions.length).toBe(1);
        expect($(selectedOptions[0]).text().trim()).toBe("2016 Boundaries / equal area hexagon");
    });

    test('Check Boundary options order depend upon order of version', () => {
        const controller = new Controller(this, null, config, 1);

        let versionController = new VersionController(controller, "ZA", true);
        versionController.activeVersion = version2;

        let component = new Component();
        let boundaryTypeBox = new BoundaryTypeBox(component, preferredChildren);

        boundaryTypeBox.activeVersion = version2;
        boundaryTypeBox.populateBoundaryOptions(versionGeometries, "district", [version2, version1])

        // assert options
        let options = document.querySelectorAll(`${selectElement} .dropdown__list_item`);
        expect(options.length).toBe(3);
        expect($(options[0]).text().trim()).toBe("2016 Boundaries / equal area hexagon");
        expect($(options[1]).text().trim()).toBe("2011 Boundaries / mainplace");
        expect($(options[2]).text().trim()).toBe("2011 Boundaries / ward");

        // assert Selected options
        let selectedOptions = document.querySelectorAll(`${selectElement} .dropdown-menu__selected-item`);
        expect(selectedOptions.length).toBe(1);
        expect($(selectedOptions[0]).text().trim()).toBe("2016 Boundaries / equal area hexagon");
    });

    test('Check Boundary option selection depends upon preferred children order', () => {
        const controller = new Controller(this, null, config, 1);

        let versionController = new VersionController(controller, "ZA", true);
        versionController.activeVersion = version1;

        let component = new Component();
        let boundaryTypeBox = new BoundaryTypeBox(component, preferredChildren);

        boundaryTypeBox.activeVersion = version1;
        boundaryTypeBox.populateBoundaryOptions(versionGeometries, "district", [version1])

        // assert options
        let options = document.querySelectorAll(`${selectElement} .dropdown__list_item`);
        expect(options.length).toBe(2);
        expect($(options[0]).text().trim()).toBe("2011 Boundaries / mainplace");
        expect($(options[1]).text().trim()).toBe("2011 Boundaries / ward");

        // assert Selected options
        let selectedOptions = document.querySelectorAll(`${selectElement} .dropdown-menu__selected-item`);
        expect(selectedOptions.length).toBe(1);
        expect($(selectedOptions[0]).text().trim()).toBe("2011 Boundaries / mainplace");

        let preferredChildrenUpdatedOrder = {
            "district" : ["ward", "mainplace", "equal area hexagon"]
        }

        boundaryTypeBox = new BoundaryTypeBox(component, preferredChildrenUpdatedOrder);

        boundaryTypeBox.activeVersion = version1;
        boundaryTypeBox.populateBoundaryOptions(versionGeometries, "district", [version1]);

        options = document.querySelectorAll(`${selectElement} .dropdown__list_item`);
        expect(options.length).toBe(2);
        expect($(options[0]).text().trim()).toBe("2011 Boundaries / mainplace");
        expect($(options[1]).text().trim()).toBe("2011 Boundaries / ward");

        // assert Selected options
        selectedOptions = document.querySelectorAll(`${selectElement} .dropdown-menu__selected-item`);
        expect(selectedOptions.length).toBe(1);
        expect($(selectedOptions[0]).text().trim()).toBe("2011 Boundaries / ward");
    });

    test('Check Boundary type box is shown when no children', () => {
        // set version2 children
        versionGeometries["2016 Boundaries"]["children"] = {};

        const controller = new Controller(this, null, config, 1);
        let versionController = new VersionController(controller, "ZA", true);
        versionController.activeVersion = version2;

        let component = new Component();
        let boundaryTypeBox = new BoundaryTypeBox(component, preferredChildren);

        boundaryTypeBox.activeVersion = version2;
        boundaryTypeBox.populateBoundaryOptions(versionGeometries, "district", [version2])

        // assert options
        let options = document.querySelectorAll(`${selectElement} .dropdown__list_item`);
        expect(options.length).toBe(1);
        expect($(options[0]).text().trim()).toBe("2016 Boundaries");

        // assert Selected options
        let selectedOptions = document.querySelectorAll(`${selectElement} .dropdown-menu__selected-item`);
        expect(selectedOptions.length).toBe(1);
        expect($(selectedOptions[0]).text().trim()).toBe("2016 Boundaries");
    });
})
