import {screen, fireEvent, getByText} from '@testing-library/dom'

import {VersionController} from "../../../src/js/versions/version_controller.js";
import {Version} from "../../../src/js/versions/version.js";
import {Component} from '../../../src/js/utils';
import Controller from "../../../src/js/controller";
import {BoundaryTypeBox} from "../../../src/js/map/boundary_type_box.js";

import html from '../../../src/index.html';
import {TestData} from "../../../src/js/test_data";
import {Config as SAConfig} from "../../../src/js/configurations/geography_sa";


describe('Selecting a subindicator', () => {
    beforeEach(() => {
        document.body.innerHTML = html;
    });
    let td = new TestData();
    let versionGeometries = {
        "2011 Boundaries": {
            "children": {
                "mainplace": {
                    "type": "FeatureCollection",
                },
                "ward": {
                    "type": "FeatureCollection",
                },
                "ward1": {
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
        "disctrict" : ["mainplace", "ward", "ward1", "equal area hexagon"]
    }

    test('Check Boundary type options', () => {
        // let component = new Component();
        let config = new SAConfig();
        const controller = new Controller(this, null, config, 1);
        let version = new Version("2011 Boundaries", true);
        version.exists = true;
        let versionController = new VersionController(controller, "ZA", true);
        versionController.activeVersion = version;
        let component = new Component();
        let boundaryTypeBox = new BoundaryTypeBox(component, preferredChildren);

        boundaryTypeBox.activeVersion = version;
        boundaryTypeBox.populateBoundaryOptions(versionGeometries, "disctrict", [version])

        console.log(document.querySelector('.map-geo-select').outerHTML);



        // let mapOptions = document.querySelector(`${mapBottomItems} .map-options`);
        // expect(mapOptions).not.toHaveClass('hidden');
    })
})
