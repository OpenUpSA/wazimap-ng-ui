import html2canvas from 'html2canvas';

import {Observable, saveAs} from "../utils";
import {MapChip} from "../elements/mapchip";

export class MapDownload extends Observable {
    constructor() {
        super();
        this.mapChip = new MapChip();
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
        $(element).append(title);

        html2canvas(element, options).then(function (canvas) {
            $(title).remove();
            saveAs(canvas.toDataURL(), 'map.png');
        });
    }
}
