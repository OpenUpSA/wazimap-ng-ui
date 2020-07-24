import {TutorialBox} from "../elements/tutorial_box";
import {ProfileLayout} from "../elements/profile_layout";
import PDFPrinter from '../print';

export const tutorialBox = new TutorialBox();
export const profileLayout = new ProfileLayout();
export const pdfprinter = new PDFPrinter();
export const printButton = $("#profile-print");

export function configureMiscElementEvents(controller) {

    controller.on('profile.loaded', payload => tutorialBox.prepTutorialBox(payload.payload))
    controller.on('profile.loaded', payload => profileLayout.displayLogo(payload.payload.logo))
    controller.on('printProfile', payload => pdfprinter.printDiv(payload))

    printButton.on("click", payload => controller.onPrintProfile(payload));

    // Choropleth filter toggle
    $('.filters__header_toggle').click(() => {
        controller.triggerEvent('mapchip.toggle');
    }) 

    // Rich data panel
    $('.rich-data-toggles .panel-toggle:nth-child(1)').click(() => {
        controller.triggerEvent('panel.rich_data.closed');
    }) 

    $('.rich-data-toggles .panel-toggle:nth-child(2)').click(() => {
        controller.triggerEvent('panel.point_mapper.opened');
        controller.triggerEvent('panel.rich_data.closed');
    }) 

    $('.rich-data-toggles .panel-toggle:nth-child(3)').click(() => {
        controller.triggerEvent('panel.data_mapper.opened');
        controller.triggerEvent('panel.rich_data.closed');
    }) 

    // Point data panel
    $('.point-mapper-toggles .panel-toggle:nth-child(1)').click(() => {
        controller.triggerEvent('panel.rich_data.opened');
        controller.triggerEvent('panel.point_mapper.closed');
    }) 

    $('.point-mapper-toggles .panel-toggle:nth-child(2)').click(() => {
        controller.triggerEvent('panel.point_mapper.closed');
    }) 

    $('.point-mapper-toggles .panel-toggle:nth-child(3)').click(() => {
        controller.triggerEvent('panel.data_mapper.opened');
        controller.triggerEvent('panel.point_mapper.closed');
    }) 


    $('.data-mapper-toggles .panel-toggle:nth-child(1)').click(() => {
        controller.triggerEvent('panel.rich_data.opened');
        controller.triggerEvent('panel.rich_data.closed');
    }) 


    // Data mapper panel 
    $('.data-mapper-toggles .panel-toggle:nth-child(1)').click(() => {
        controller.triggerEvent('panel.rich_data.opened');
        controller.triggerEvent('panel.data_mapper.closed');
    }) 

    $('.data-mapper-toggles .panel-toggle:nth-child(2)').click(() => {
        controller.triggerEvent('panel.point_mapper.opened');
        controller.triggerEvent('panel.data_mapper.closed');
    }) 

    $('.data-mapper-toggles .panel-toggle:nth-child(3)').click(() => {
        controller.triggerEvent('panel.data_mapper.closed');
    }) 

    // All panels
    $('.panel-toggles .panel-toggle:nth-child(1)').click(() => {
        controller.triggerEvent('panel.rich_data.opened');
    }) 

    $('.panel-toggles .panel-toggle:nth-child(2)').click(() => {
        controller.triggerEvent('panel.point_data.opened');
    }) 

    $('.panel-toggles .panel-toggle:nth-child(3)').click(() => {
        controller.triggerEvent('panel.data_mapper.opened');
    }) 

}
