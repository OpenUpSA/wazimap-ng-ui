import {TutorialBox} from "../elements/tutorial_box";
import {ProfileLayout} from "../elements/profile_layout";
import PDFPrinter from '../print';
import {SidePanels} from '../elements/side_panels';

export const tutorialBox = new TutorialBox();
export const profileLayout = new ProfileLayout();
export const pdfprinter = new PDFPrinter();
export const printButton = $("#profile-print");

export function configureMiscElementEvents(controller) {
    const sidePanels = new SidePanels();

    controller.on('profile.loaded', payload => tutorialBox.prepTutorialBox(payload.payload))
    controller.on('profile.loaded', payload => profileLayout.displayLogo(payload.payload.logo))
    controller.on('printProfile', payload => pdfprinter.printDiv(payload))

    printButton.on("click", payload => controller.onPrintProfile(payload));

    // Choropleth filter toggle
    $('.filters__header_toggle').click(() => {
        controller.triggerEvent('mapchip.toggle');
    }) 

    controller.bubbleEvents(sidePanels, [
        'panel.rich_data.closed', 'panel.rich_data.opened',
        'panel.point_mapper.closed', 'panel.point_mapper.opened',
        'panel.data_mapper.closed', 'panel.data_mapper.opened',
    ]);
}
