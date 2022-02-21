import html2canvas from 'html2canvas';

import {Component, saveAs} from "../utils";

export class MapDownload extends Component {
    constructor(parent, mapChip) {
        super(parent);

        this.mapChip = mapChip;
        this.prepareDomElements();
    }

    prepareDomElements = () => {
        $('.map-download').removeClass('disabled');

        $('.map-download').on('click', () => {
            this.startMapDownload();
        });
    }

    startMapDownload = () => {
        this.triggerEvent('mapdownload.started');
        this.titleClass = '.map-title';
        this.legendClass = '.map-bottom-items--v2';
        this.downloadMap();
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

        $(element).css('justify-content', 'center');
        $(element).css('display', 'flex');

        const options = {
            useCORS: true,
            onclone: (clonedElement) => {
                if (this.mapChip.title !== '') {
                    $(clonedElement).find(self.titleClass).show();
                }

                $(clonedElement).find('.visible-in-download').each(function () {
                    $(this).removeClass('hidden');
                })

                $(clonedElement).find(self.legendClass).removeClass('hidden');
            }
        };

        setTimeout(() => {
            html2canvas(element, options).then(function (canvas) {
                $(element).find(title).remove();
                $(element).css('justify-content', 'unset');
                $(element).css('display', 'block');
                $(clonedLegend).remove();
                saveAs(canvas.toDataURL(), 'map.png');
                self.triggerEvent('mapdownload.completed');
            });
        }, 10)
    }
}

