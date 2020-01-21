import {Observable} from './utils';

let clonedMapChip;

/**
 * Represent the map chip at the bottom of the map
 */
export class MapChip extends Observable {
    constructor() {
		super();
        // store the current chip as the template and hide it (something similar to search.js:39) - DONE
		
        // also create an event handler on the X (see search.js:86) - DONE
        // in the click handler trigger a close event (e.g. search.js:99), it should also hide the chip. - DONE


        // You also need to refactor some old code which was written prior to this class
        // map_panel.js:9-11 should be removed. Instead, this component should listen to a subindicatorClick event, see row load.js:77 - DONE
        // this shoduld effectively replace map_panel.js entirely. When you receive a subindicatorClick event, change the text on the chip and show it. - DONE

        // you will also need to instantiate the widget in load.js (see load.js:22) - DONE
		
		this.prepareDomElements();
    }
	
	prepareDomElements = () =>{
        clonedMapChip = $('.chip--map')[0].cloneNode(true);
        this.clearAllMapChip();
    }
	
	showMapChip = () =>{
		let element = $(clonedMapChip);
		$('.content__map_current-display').append(element);
		element.find('.chip__remove--map').on('click', () => this.mapChipRemoved(element));
	}
	
	mapChipRemoved = (element) =>{
		this.triggerEvent('removeMapChip', element);
	}
	
	clearAllMapChip = () =>{
        $('.content__map_current-display').html('');
    }
	
	onSubIndicatorChange = (payload) => {
		var label = `${payload.indicator} (${payload.obj.key})`
		this.updateMapChipText(label);
		this.showMapChip();
	}

	updateMapChipText = (textValue) => {
		$(clonedMapChip).find( '.truncate' ).text(textValue);
	}


}