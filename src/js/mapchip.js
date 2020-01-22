import {Observable} from './utils';

let clonedMapChip;

/**
 * Represent the map chip at the bottom of the map
 */
export class MapChip extends Observable {
    constructor() {
		super();		
		this.prepareDomElements();
    }
	
	prepareDomElements() {
        clonedMapChip = $('.chip--map')[0].cloneNode(true);
		$(clonedMapChip).removeClass('hide');
        this.clearAllMapChip();
    }
	
	showMapChip() {
		const element = $(clonedMapChip);
		$('.content__map_current-display').append(element);
		element.find('.chip__remove--map').on('click', () => this.removeMapChip(element));
	}
	
	clearAllMapChip() {
        $('.content__map_current-display').html('');
    }
	
	removeMapChip(element) {
		element.remove();
		this.triggerEvent('mapChipRemoved', element);
	}
	
	onSubIndicatorChange(payload) {
		const label = `${payload.indicator} (${payload.obj.key})`
		this.updateMapChipText(label);
		this.showMapChip();
	}

	updateMapChipText(textValue) {
		$(clonedMapChip).find( '.truncate' ).text(textValue);
	}


}