import {Observable} from '../utils';

export const RICH_DATA_PANEL = "rich_data";
export const POINT_DATA_PANEL = "point_data";
export const DATA_EXPLORER_PANEL = "data_explorer";
export const NO_PANELS = "no_panels";

export class SidePanels extends Observable {
    constructor() {
        super();
        this.prepareDomElements();
        this.initialiseTriggers();
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
        this.initialiseMapeExplorerTriggers();
        this.initialiseBlankTriggers();
    }

    initialiseRichDataTriggers = () => {
        this.richDataPanel.richData.click(() => {
            this.triggerEvent('panel.rich_data.closed');
        })

        this.richDataPanel.pointData.click(() => {
            this.triggerEvent('panel.point_mapper.opened');
            this.triggerEvent('panel.rich_data.closed');
        })

        this.richDataPanel.mapExplorer.click(() => {
            this.triggerEvent('panel.data_mapper.opened');
            this.triggerEvent('panel.rich_data.closed');
        })
    }

    initialisePointDataTriggers = () => {
        this.pointDataPanel.richData.click(() => {
            this.triggerEvent('panel.rich_data.opened');
            this.triggerEvent('panel.point_mapper.closed');
        })

        this.pointDataPanel.pointData.click(() => {
            this.triggerEvent('panel.point_mapper.closed');
        })

        this.pointDataPanel.mapExplorer.click(() => {
            this.triggerEvent('panel.data_mapper.opened');
            this.triggerEvent('panel.point_mapper.closed');
        })
    }

    initialiseMapeExplorerTriggers = () => {
        this.mapExplorerPanel.richData.click(() => {
            this.triggerEvent('panel.rich_data.opened');
            this.triggerEvent('panel.data_mapper.closed');
        })

        this.mapExplorerPanel.pointData.click(() => {
            this.triggerEvent('panel.point_mapper.opened');
            this.triggerEvent('panel.data_mapper.closed');
        })

        this.mapExplorerPanel.mapExplorer.click(() => {
            this.triggerEvent('panel.data_mapper.closed');
        })
    }

    initialiseBlankTriggers = () => {
        this.emptyPanel.richData.click(() => {
            this.triggerEvent('panel.rich_data.opened');
        })

        this.emptyPanel.pointData.click(() => {
            this.triggerEvent('panel.point_mapper.opened');
        })

        this.emptyPanel.mapExplorer.click(() => {
            this.triggerEvent('panel.data_mapper.opened');
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

    togglePanel = panel => {
        switch(panel) {
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
}
