import html2canvas from 'html2canvas';

import {Observable, saveAs} from "../utils";

export class MapDownload extends Observable {
    constructor(mapChip) {
        super();
        this.mapChip = mapChip;
        this.prepareDomElements();
    }

    prepareDomElements = () => {
        $('.map-download').on('click', () => {
            this.triggerEvent('mapdownload.started');
            this.downloadMap();
        });
    }

    downloadMap = () => {
        let self = this;

        const options = {
            useCORS: true
        };
        const title = $(`<div id="map-download-title">${this.mapChip.title}</div>`);
        const element = document.getElementById("main-map");

        const legend = document.querySelector('.map-options__legend');
        let clonedLegend = legend.cloneNode(true);
        $(clonedLegend).find('.map-options__legend_label').remove();
        clonedLegend.id = 'map-download-legend';

        $(element).append(title);
        $(element).append(clonedLegend);

        setTimeout(() => {
            html2canvas(element, options).then(function (canvas) {
                $(title).remove();
                $(clonedLegend).remove();
                saveAs(canvas.toDataURL(), 'map.png');
                self.triggerEvent('mapdownload.completed');
            });
        }, 10)
    }
}
