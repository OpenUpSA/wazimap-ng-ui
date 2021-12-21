import {Component} from '../utils';

const MAP_DOWNLOAD_BTN = ".map-download";

export class SidePanels extends Component {
    static PANELS = {
        richData: 'rich_data',
        pointData: 'point_data',
        dataMapper: 'data_explorer',
        noPanels: 'no_panels'
    }

    constructor(parent, showPanels) {
        super(parent);

        this.prepareDomElements();
        this.initialiseTriggers();

        this.currentPanel = null;

        if (!showPanels[SidePanels.PANELS.richData]) this.hidePanel('richData')
        if (!showPanels[SidePanels.PANELS.pointData]) this.hidePanel('pointData')
        if (!showPanels[SidePanels.PANELS.dataMapper]) this.hidePanel('mapExplorer')
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
            case SidePanels.PANELS.richData:
                this.toggleRichData()
                break;
            case SidePanels.PANELS.pointData:
                this.togglePointData()
                break;
            case SidePanels.PANELS.dataMapper:
                this.toggleMapExplorer()
                break;
            default:
                break;
        }
    }

    closePanel = panel => {
        switch (panel) {
            case SidePanels.PANELS.richData:
                this.richDataPanel.richData.click();
                break;
            case SidePanels.PANELS.pointData:
                this.pointDataPanel.pointData.click();
                break;
            case SidePanels.PANELS.dataMapper:
                this.mapExplorerPanel.mapExplorer.click();
                break;
            default:
                break;
        }
    }

    setPanels = (isRichDataOpen, isPointMapperOpen, isDataMapperOpen) => {
        if (isRichDataOpen) {
            this.currentPanel = SidePanels.PANELS.richData;
            this.triggerEvent('panel.rich_data.opened');
        } else
            this.triggerEvent('panel.rich_data.closed');

        if (isPointMapperOpen) {
            this.currentPanel = SidePanels.PANELS.pointData;
            this.triggerEvent('panel.point_mapper.opened');
        } else
            this.triggerEvent('panel.point_mapper.closed');

        if (isDataMapperOpen) {
            this.currentPanel = SidePanels.PANELS.dataMapper;
            this.triggerEvent('panel.data_mapper.opened');
        } else
            this.triggerEvent('panel.data_mapper.closed');

        if (isRichDataOpen || isPointMapperOpen || isDataMapperOpen)
            $(MAP_DOWNLOAD_BTN).attr('title', 'The panes on the left will be closed to download the full-screen map');
        else {
            $(MAP_DOWNLOAD_BTN).removeAttr('title');
            this.currentPanel = null;
        }
    }

    closeAllPanels = () => {
        if (this.currentPanel === null) {
            return;
        }

        this.closePanel(this.currentPanel);
        this.currentPanel = null;
    }
}
