import {ProfileLayout} from "../elements/profile_layout";
import PDFPrinter from '../print';
import {SidePanels, RICH_DATA_PANEL, POINT_DATA_PANEL, DATA_EXPLORER_PANEL} from '../elements/side_panels';

export const profileLayout = new ProfileLayout();
export const pdfprinter = new PDFPrinter();
export const printButton = $("#profile-print");

export function configureMiscElementEvents(controller) {
    let showPanels = {}

    showPanels[RICH_DATA_PANEL] = controller.config.panelEnabled(RICH_DATA_PANEL)
    showPanels[POINT_DATA_PANEL] = controller.config.panelEnabled(POINT_DATA_PANEL)
    showPanels[DATA_EXPLORER_PANEL] = controller.config.panelEnabled(DATA_EXPLORER_PANEL)

    const sidePanels = new SidePanels(showPanels);
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

    sidePanels.togglePanel(defaultPanel);

}
