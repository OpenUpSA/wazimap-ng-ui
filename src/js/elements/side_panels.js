import {Component} from '../utils';

export const RICH_DATA_PANEL = "rich_data";
export const POINT_DATA_PANEL = "point_data";
export const DATA_EXPLORER_PANEL = "data_explorer";
export const NO_PANELS = "no_panels";
const MAP_DOWNLOAD_BTN = ".map-download";

export class SidePanels extends Component {
    constructor(parent, showPanels) {
        super(parent);

        this.prepareDomElements();
        this.initialiseTriggers();

        if (!showPanels[RICH_DATA_PANEL]) this.hidePanel("richData")
        if (!showPanels[POINT_DATA_PANEL]) this.hidePanel("pointData")
        if (!showPanels[DATA_EXPLORER_PANEL]) this.hidePanel("mapExplorer")
    }

    prepareDomElements = () => {
        this.richDataPanel = {
            richData: $('.rich-data-toggles .panel-toggle:nth-child(1)'),
            pointData: $('.rich-data-toggles .panel-toggle:nth-child(2)'),
            mapExplorer: $('.rich-data-toggles .panel-toggle:nth-child(3)'),
        }

        this.pointDataPanel = {
            richData: $('.point-mapper-toggles .panel-toggle:nth-child(1)'),
            pointData: $('.point-mapper-toggles .panel-toggle:nth-child(2)'),
            mapExplorer: $('.point-mapper-toggles .panel-toggle:nth-child(3)'),
        }

        this.mapExplorerPanel = {
            richData: $('.data-mapper-toggles .panel-toggle:nth-child(1)'),
            pointData: $('.data-mapper-toggles .panel-toggle:nth-child(2)'),
            mapExplorer: $('.data-mapper-toggles .panel-toggle:nth-child(3)'),
        }

        this.emptyPanel = {
            richData: $('.panel-toggles .panel-toggle:nth-child(1)'),
            pointData: $('.panel-toggles .panel-toggle:nth-child(2)'),
            mapExplorer: $('.panel-toggles .panel-toggle:nth-child(3)'),
        }
    }

    initialiseTriggers = () => {
        this.initialiseRichDataTriggers();
        this.initialisePointDataTriggers();
        this.initialiseMapExplorerTriggers();
        this.initialiseBlankTriggers();
    }

    initialiseRichDataTriggers = () => {
        this.richDataPanel.richData.click(() => {
            this.setPanels(false, false, false)
        })

        this.richDataPanel.pointData.click(() => {
            this.setPanels(false, true, false)
        })

        this.richDataPanel.mapExplorer.click(() => {
            this.setPanels(false, false, true)
        })
    }

    initialisePointDataTriggers = () => {
        this.pointDataPanel.richData.click(() => {
            this.setPanels(true, false, false)
        })

        this.pointDataPanel.pointData.click(() => {
            this.setPanels(false, false, false)
        })

        this.pointDataPanel.mapExplorer.click(() => {
            this.setPanels(false, false, true)
        })
    }

    initialiseMapExplorerTriggers = () => {
        this.mapExplorerPanel.richData.click(() => {
            this.setPanels(true, false, false)
        })

        this.mapExplorerPanel.pointData.click(() => {
            this.setPanels(false, true, false)
        })

        this.mapExplorerPanel.mapExplorer.click(() => {
            this.setPanels(false, false, false)
        })
    }

    initialiseBlankTriggers = () => {
        this.emptyPanel.richData.click(() => {
            this.setPanels(true, false, false)
        })

        this.emptyPanel.pointData.click(() => {
            this.setPanels(false, true, false)
        })

        this.emptyPanel.mapExplorer.click(() => {
            this.setPanels(false, false, true)
        })
    }

    toggleRichData = () => {
        this.emptyPanel.richData.click();
    }

    togglePointData = () => {
        this.emptyPanel.pointData.click();
    }

    toggleMapExplorer = () => {
        this.emptyPanel.mapExplorer.click();
    }

    hidePanel = (panel) => {
        this.emptyPanel[panel].hide();
        this.mapExplorerPanel[panel].hide();
        this.richDataPanel[panel].hide();
        this.pointDataPanel[panel].hide();
    }

    togglePanel = panel => {
        switch (panel) {
            case RICH_DATA_PANEL:
                this.toggleRichData()
                break;
            case POINT_DATA_PANEL:
                this.togglePointData()
                break;
            case DATA_EXPLORER_PANEL:
                this.toggleMapExplorer()
                break;
            default:
                break;
        }
    }

    setPanels = (isRichDataOpen, isPointMapperOpen, isDataMapperOpen) => {
        if (isRichDataOpen)
            this.triggerEvent('panel.rich_data.opened');
        else
            this.triggerEvent('panel.rich_data.closed');

        if (isPointMapperOpen)
            this.triggerEvent('panel.point_mapper.opened');
        else
            this.triggerEvent('panel.point_mapper.closed');

        if (isDataMapperOpen)
            this.triggerEvent('panel.data_mapper.opened');
        else
            this.triggerEvent('panel.data_mapper.closed');

        if (isRichDataOpen || isPointMapperOpen || isDataMapperOpen) {
            $(MAP_DOWNLOAD_BTN).addClass('disabled');
            $(MAP_DOWNLOAD_BTN).css('pointer-events', 'unset');
            $(MAP_DOWNLOAD_BTN).attr('title', 'Please close the panel on the left to be able to download the map');
        } else {
            $(MAP_DOWNLOAD_BTN).removeClass('disabled');
            $(MAP_DOWNLOAD_BTN).removeAttr('title').removeAttr('style');
        }
    }
}
