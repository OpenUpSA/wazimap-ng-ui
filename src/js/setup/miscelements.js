import {ProfileLayout} from "../elements/profile_layout";
import PDFPrinter from '../print';
import {SidePanels} from '../elements/side_panels';

export let profileLayout = new ProfileLayout();
export let pdfprinter = new PDFPrinter();
export const printButton = $("#profile-print");

export function configureMiscElementEvents(application, controller) {
    profileLayout = new ProfileLayout(application);
    pdfprinter = new PDFPrinter(application);

    let showPanels = {}

    showPanels[SidePanels.PANELS.richData] = controller.config.panelEnabled(SidePanels.PANELS.richData)
    showPanels[SidePanels.PANELS.pointData] = controller.config.panelEnabled(SidePanels.PANELS.pointData)
    showPanels[SidePanels.PANELS.dataMapper] = controller.config.panelEnabled(SidePanels.PANELS.dataMapper)

    const sidePanels = new SidePanels(application, showPanels);
    const defaultPanel = controller.config.defaultPanel;

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

    setTimeout(() => {
        sidePanels.togglePanel(defaultPanel);
    }, 0)

    controller.on('mapdownload.started', () => {
        sidePanels.closeAllPanels();
    });

    controller.on('open.rich_data.panel', () => {
        sidePanels.togglePanel(SidePanels.PANELS.richData);
    });
}
