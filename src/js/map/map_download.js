import {Observable} from "../utils";
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
        let self = this;

        html2canvas(element, options).then(function (canvas) {
            self.saveAs(canvas.toDataURL(), 'map.png');
        });
    }

    saveAs = (uri, filename) => {
        let link = document.createElement('a');
        if (typeof link.download === 'string') {

            link.href = uri;
            link.download = filename;

            //Firefox requires the link to be in the body
            document.body.appendChild(link);

            //simulate click
            link.click();

            //remove the link when done
            document.body.removeChild(link);

        } else {
            window.open(uri);
        }
    }
}