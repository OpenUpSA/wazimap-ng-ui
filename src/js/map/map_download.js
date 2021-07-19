import html2canvas from 'html2canvas';

import {Component, saveAs} from "../utils";

export class MapDownload extends Component {
    constructor(parent, mapChip) {
        super(parent);

        this.mapChip = mapChip;
        this.prepareDomElements();
    }

    prepareDomElements = () => {
        $('.map-download').on('click', () => {
            this.triggerEvent('mapdownload.started');
            this.titleClass = '.map-title';
            this.legendClass = '.map-bottom-items';
            this.downloadMap();
        });
    }

    disableButton = () => {
        $('.map-download').addClass('disabled');
    }

    enableButton = () => {
        $('.map-download').removeClass('disabled');
    }

    downloadMap = () => {
        let self = this;

        const element = document.getElementById("main-map");
        const title = $(self.titleClass)[0].cloneNode(true);
        $(title).text(this.mapChip.title);

        const legend = document.querySelector(self.legendClass);
        let clonedLegend = legend.cloneNode(true);
        $(clonedLegend).addClass('hidden').addClass('export-clone');

        $(element).append(clonedLegend);
        $(element).prepend(title);

        const options = {
            useCORS: true,
            onclone: (clonedElement) => {
                if (this.mapChip.title !== '') {
                    $(clonedElement).find(self.titleClass).show();
                }

                $(clonedElement).find(self.legendClass).removeClass('hidden');
            }
        };

        setTimeout(() => {
            html2canvas(element, options).then(function (canvas) {
                $(element).find(title).remove();
                $(clonedLegend).remove();
                saveAs(canvas.toDataURL(), 'map.png');
                self.triggerEvent('mapdownload.completed');
            });
        }, 10)
    }
}

