import {Observable} from './utils';

/**
 * Represent the map chip at the bottom of the map
 */
export class MapChip extends Observable {
    constructor() {
        // store the current chip as the template and hide it (something similar to search.js:39)
        // also create an event handler on the X (see search.js:86)
        // in the click handler trigger a close event (e.g. search.js:99), it should also hide the chip.


        // You also need to refactor some old code which was written prior to this class
        // map_panel.js:9-11 should be removed. Instead, this component should listen to a subindicatorClick event, see row load.js:77
        // this shoduld effectively replace map_panel.js entirely. When you receive a subindicatorClick event, change the text on the chip and show it.
    }


}