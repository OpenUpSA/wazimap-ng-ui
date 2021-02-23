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
            this.titleClass = '.map-title';
            this.legendClass = '.map-options__legend';
            this.downloadMap();
        });
    }

    downloadMap = () => {
        let self = this;

        const element = document.getElementById("main-map");
        const title = $(self.titleClass)[0].cloneNode(true);
        $(title).text(this.mapChip.title);

        const legend = document.querySelector(self.legendClass);
        let clonedLegend = legend.cloneNode(true);
        $(clonedLegend).find('.map-options__legend_label').remove();
        clonedLegend.id = 'map-download-legend';

        $(element).append(clonedLegend);
        $(element).prepend(title);

        const options = {
            useCORS: true,
            onclone: (clonedElement) => {
                if (this.mapChip.title !== '') {
                    $(clonedElement).find(self.titleClass).show();
                } else {
                    $(clonedElement).find(self.legendClass).remove();
                }
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
