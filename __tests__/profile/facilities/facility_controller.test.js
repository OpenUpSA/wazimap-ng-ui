import html from '../../../src/index.html';
import {FacilityController} from "../../../src/js/profile/facilities/facility_controller";
import {Component} from "../../../src/js/utils";

describe('Facilities', () => {
    beforeEach(() => {
        document.body.innerHTML = html;
    })

    test('Hide Facilities button is not triggered if the facilities are not expanded', () => {
        const c = new Component();
        const facilityController = new FacilityController(c);
        $('.location__facilities_contract').on('click', () => {
           fail('Hide Facilities button click event should not be fired');
        })

        facilityController.isLoading = true;
    })
})