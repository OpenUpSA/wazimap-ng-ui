import {Observable} from './utils';
import {map} from "leaflet/dist/leaflet-src.esm";

let clonedMapChip;
let clonedLegendBlock;
let clonedLegend;

const wrapperClsName = 'content__map_current-display';
const lightStart = 6;

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

    showLegend(payload, legendColors) {
        if (payload.subindicators === null || typeof payload.subindicators === 'undefined' || payload.subindicators.length <= 0) {
            return;
        }

        const legend = $(clonedLegend);
        $('.' + wrapperClsName).append(legend);	    //legend
        $('.' + wrapperClsName + ' .map_legend-block').remove(); //remove the previous legends

        for (let i = 0; i < legendColors.length; i++) {
            const item = clonedLegendBlock.cloneNode(true);
            if (i >= lightStart) {
                $(item).addClass('light');
            }

            $('.truncate', item).text(legendColors[i].percentage + '%');
            $(item).css('background-color', legendColors[i].fillColor);
            $('.' + wrapperClsName + ' .content__map_legend').append(item);
        }
    }

    clearAllMapChip() {
        $('.' + wrapperClsName).html('');
    }

    removeMapChip(element) {
        element.remove();
        this.triggerEvent('mapChipRemoved', element);
    }

    onSubIndicatorChange(payload, legendColors) {
        const label = `${payload.indicator} (${payload.obj.label})`
        this.updateMapChipText(label);
        this.showMapChip();
        this.showLegend(payload, legendColors);
    }

    updateMapChipText(textValue) {
        $(clonedMapChip).find('.truncate').text(textValue);
    }


}
