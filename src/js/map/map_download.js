import {Observable, saveAs} from "../utils";
import html2canvas from 'html2canvas';

export class MapDownload extends Observable {
    constructor() {
        super();

        this.prepareDomElements();
    }

    prepareDomElements = () => {
        $('.map-download').click(() => {
            this.downloadMap();
        });
    }

    downloadMap = () => {
        let options = {
            useCORS: true
        };
        let element = document.getElementById("main-map");

        html2canvas(element, options).then(function (canvas) {
            saveAs(canvas.toDataURL(), 'map.png');
        });
    }


}