import html2canvas from 'html2canvas';

import {Observable, saveAs} from "../utils";

export class MapDownload extends Observable {
    constructor(mapChip) {
        super();
        this.mapChip = mapChip;
        this.prepareDomElements();
    }

    prepareDomElements = () => {
        $('.map-download').click(() => {
            this.downloadMap();
        });
    }

    downloadMap = () => {
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

        html2canvas(element, options).then(function (canvas) {
            $(title).remove();
            $(clonedLegend).remove();
            saveAs(canvas.toDataURL(), 'map.png');
        });
    }
}
