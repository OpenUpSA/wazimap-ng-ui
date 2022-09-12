import {VersionController} from "../../../src/js/versions/version_controller.js";
import {Version} from "../../../src/js/versions/version.js";
import Controller from "../../../src/js/controller";

import html from '../../../src/index.html';
import {Config as SAConfig} from "../../../src/js/configurations/geography_sa";


describe('Check event calls while redrawing child boundaries on version selection', () => {
    let version1, version2, versionGeometries, assertValues, controller;

    beforeEach(() => {
        document.body.innerHTML = html;

        let config = new SAConfig();
        versionGeometries = {
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
        // version - 2011
        version1 = new Version("2011 Boundaries", true);
        version1.exists = true;
        version1.model.isActive = false;

        // verison - 2016
        version2 = new Version("2016 Boundaries", true);
        version2.exists = true;
        version2.model.isActive = false;

        controller = new Controller(this, null, config, 1);
        controller.state.profile = {profile: {}};
        controller.versionController = new VersionController(controller, "CPT");
        controller.versionController.versions = [version1, version2]
        controller.versionController.activeVersion = version1;

        controller.versionController.addVersionGeometry(version1, versionGeometries["2011 Boundaries"]);
        controller.versionController.addVersionGeometry(version2, versionGeometries["2016 Boundaries"]);

        assertValues = [];
        controller.on('redraw', payload => {
            assertValues.push(payload.payload);
        });
    });

    test("Check reDraw for active version", () => {
      controller.reDrawChildren();
      expect(version1.model.isActive).toBe(true);
      expect(version1.model.name).toBe("2011 Boundaries");
      expect(assertValues.length).toBe(1);
      expect(assertValues[0].geometries).toMatchObject(versionGeometries[version1.model.name])
    });

    test("Check reDraw for inactive version", () => {
      controller.reDrawChildren();
      expect(assertValues.length).toBe(1);
      expect(assertValues[0].geometries).toMatchObject(versionGeometries[version1.model.name]);

      controller.versionController.activeVersion = version2;
      controller.reDrawChildren();
      expect(version2.model.isActive).toBe(true);
      expect(version2.model.name).toBe("2016 Boundaries");
      expect(assertValues.length).toBe(2);
      expect(assertValues[1].geometries).toMatchObject(versionGeometries[version2.model.name]);

    });
})
