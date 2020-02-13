import {Observable} from './utils';
import {map} from "leaflet/dist/leaflet-src.esm";

let clonedMapChip;
let clonedLegendBlock;
let clonedLegend;

const wrapperClsName = 'content__map_current-display';

/**
 * Represent the map chip at the bottom of the map
 */
export class MapChip extends Observable {
    constructor() {
        super();
        this.prepareDomElements();
    }

    prepareDomElements() {
        clonedMapChip = $('.chip--map')[0].cloneNode(true);	//chip
        clonedLegendBlock = $('.map_legend-block')[0].cloneNode(true);	//a legend block
        clonedLegend = $('.content__map_legend')[0].cloneNode(true);	//the legend itself

        $(clonedMapChip).removeClass('hide');
        this.clearAllMapChip();
    }

    showMapChip() {
        const element = $(clonedMapChip);

        $('.' + wrapperClsName).append(element);	//chip
        element.find('.chip__remove--map').on('click', () => this.removeMapChip(element));
    }

    showLegend(payload, mapLayers) {
        if (payload.subindicators === null || typeof payload.subindicators === 'undefined' || payload.subindicators.length <= 0) {
            return;
        }

        let subIndicators = payload.subindicators;
        let children = Object.keys(subIndicators[0].children);
        const legend = $(clonedLegend);
        $('.' + wrapperClsName).append(legend);	    //legend
        $('.' + wrapperClsName + ' .map_legend-block').remove(); //remove the previous legends

        let blockArr = [];

        for (let i = 0; i < children.length; i++) {
            let currentChild = mapLayers[children[i]];

            const item = clonedLegendBlock.cloneNode(true);
            const perc = parseFloat((currentChild.feature.properties.percentage * 100).toFixed(2));
            const code = currentChild.feature.properties.code;
            blockArr.push({
                item: item,
                perc: perc,
                code: code,
                fillColor: currentChild.options.fillColor
            });
        }

        blockArr.sort((a, b) => (a.perc < b.perc) ? 1 : ((b.perc < a.perc) ? -1 : 0));

        for (let i = 0; i < blockArr.length; i++) {
            $(blockArr[i].item).css('background-color', blockArr[i].fillColor);
            $('.truncate', blockArr[i].item).text(blockArr[i].code + ' - ' + blockArr[i].perc + '%');
            $('.' + wrapperClsName + ' .content__map_legend').append(blockArr[i].item);
        }
    }

    clearAllMapChip() {
        $('.' + wrapperClsName).html('');
    }

    removeMapChip(element) {
        element.remove();
        this.triggerEvent('mapChipRemoved', element);
    }

    onSubIndicatorChange(payload, mapLayers) {
        const label = `${payload.indicator} (${payload.obj.label})`
        this.updateMapChipText(label);
        this.showMapChip();
        this.showLegend(payload, mapLayers);
    }

    updateMapChipText(textValue) {
        $(clonedMapChip).find('.truncate').text(textValue);
    }


}
