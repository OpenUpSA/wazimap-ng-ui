import {Category} from '../../../src/js/elements/point_tray/category';
import {Component} from '../../../src/js/utils';

import html from '../../../src/app-shell.html';


describe('Check metadata value for point tray category', () => {
    document.body.innerHTML = html;
    const component = new Component();
    const categoryItem = document.createElement("a");

    test('Check metadata values when metadata is null', () => {
        let data = { "metadata": null }
        let category = new Category(component, 1, data, categoryItem, false);
        expect(category.metadata).toMatchObject({'source': ''});
    })

    test('Check metadata values when metadata is undefined', () => {
        let data = {};
        let category = new Category(component, 1, data, categoryItem, false);
        expect(category.metadata).toMatchObject({'source': ''});
    })

    test('Check metadata values when metadata is empty object', () => {
        let data = { "metadata": {} };
        let category = new Category(component, 1, data, categoryItem, false);
        expect(category.metadata).toMatchObject({'source': ''});
    })

    test('Check metadata values when metadata is defined accurately', () => {
        let data = {
          "metadata": {
            "source": "Test Source",
            "description": "Test Description",
            "licence": null,
          }
        }

        let category = new Category(component, 1, data, categoryItem, false);
        expect(category.metadata).toMatchObject({
            "source": "Test Source",
            "description": "Test Description",
            "licence": null,
        });
    })
})
