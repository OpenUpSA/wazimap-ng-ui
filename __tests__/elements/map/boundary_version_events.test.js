import {VersionController} from "../../../src/js/versions/version_controller.js";
import {Version} from "../../../src/js/versions/version.js";
import {Component} from '../../../src/js/utils';
import Controller from "../../../src/js/controller";
import {BoundaryTypeBox} from "../../../src/js/map/boundary_type_box.js";

import html from '../../../src/index.html';
import {Config as SAConfig} from "../../../src/js/configurations/geography_sa";


describe('Check event calls while redrawing child boundaries on version selection', () => {
    beforeEach(() => {
        document.body.innerHTML = html;
    });
    let config = new SAConfig();
    let profileData = {
        "geography":  {"name": 'City of Cape Town', "code": 'CPT', "level": 'district', "versions":[], "parents":[]},
        "highlights": [],
        "parents": [],
        "profile_data": {},
        "overview": {"name": 'test', "description": 'test descpriction'}
    };
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

    let preferredChildren = {
        "district" : ["mainplace", "ward", "equal area hexagon"]
    }

    // version - 2011
    let version1 = new Version("2011 Boundaries", true);
    version1.exists = true;

    // verison - 2016
    let version2 = new Version("2016 Boundaries", true);
    version2.exists = true;

    test('Check version controller update event is called with accurate boundaries', () => {
        version1.model.isActive = false;
        config["config"]["preferred_children"] = preferredChildren;
        const controller = new Controller(this, null, config, 1);
        controller.loadProfile({"profile": null, "areaCode": "CPT"});

        // version controler setup
        controller.versionController.versions = [version1, version2];
        controller.versionController.setUpMainVersion({
          "profile": profileData,
          "children": versionGeometries["2011 Boundaries"],
        });
        controller.versionController.addVersionGeometry(version1, versionGeometries['2011 Boundaries']["children"]);
        controller.versionController.addVersionGeometry(version2, versionGeometries['2016 Boundaries']["children"]);

        // Boundary Box setup
        let component = new Component();
        let boundaryTypeBox = new BoundaryTypeBox(component, preferredChildren);

        // Select version 2011 Boundaries and check if triggers version update
        // event as currently no version is set as active
        let controllerTriggerEvent = jest.spyOn(controller, 'triggerEvent');
        controller.versionController.setActiveVersionByName("2011 Boundaries", "mainplace");

        expect(controllerTriggerEvent).toBeCalledTimes(1);
        expect(controllerTriggerEvent.mock.calls[0][0]).toEqual("version.active.updated");
        expect(
          controllerTriggerEvent.mock.calls[0][1]["geometries"]
        ).toMatchObject(versionGeometries['2011 Boundaries']["children"]);

        // Select diff level of same version and check if it trigger redraw event with
        // accurate boundaries
        let boundaryBoxEvent = jest.spyOn(boundaryTypeBox, 'triggerEvent')
        boundaryTypeBox.boundaryTypeSelected("2011 Boundaries / ward", "district");

        expect(boundaryBoxEvent).toBeCalledTimes(1);
        let testPayload = {
            "current_level": "district",
            "selected_type": "ward",
            "selected_version_name": "2011 Boundaries"
          }
        expect(boundaryBoxEvent.mock.calls[0][0]).toEqual("boundary_types.option.selected");
        expect(boundaryBoxEvent.mock.calls[0][1]).toMatchObject(testPayload);

        // Run events ran by boundary_types.option.selected
          // 1. select boundary by running onBoundaryTypeChange
          // 2. Set current version as active version

        // 1. select boundary by running onBoundaryTypeChange
        controller.onBoundaryTypeChange(testPayload);
        expect(controllerTriggerEvent).toBeCalledTimes(3);

        expect(controllerTriggerEvent.mock.calls[1][0]).toEqual("preferredChildChange");
        expect(controllerTriggerEvent.mock.calls[1][1]).toEqual("ward");

        expect(controllerTriggerEvent.mock.calls[2][0]).toEqual("redraw");
        expect(
          controllerTriggerEvent.mock.calls[2][1]["geometries"]
        ).toMatchObject(versionGeometries["2011 Boundaries"]["children"]);

        // 2. Run Set active version and it should not trigger version update
        controller.versionController.setActiveVersionByName("2011 Boundaries", "ward");
        expect(controllerTriggerEvent).toBeCalledTimes(3);

        // Try changing to 2016 Boundaries and see if it triggers version update
        controller.versionController.setActiveVersionByName("2016 Boundaries", "equal area hexagon");
        expect(controllerTriggerEvent).toBeCalledTimes(4);
        expect(controllerTriggerEvent.mock.calls[3][0]).toEqual("version.active.updated");
        expect(
          controllerTriggerEvent.mock.calls[3][1]["geometries"]
        ).toMatchObject(versionGeometries['2016 Boundaries']["children"]);
    });
})
