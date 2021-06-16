import {Component} from '../utils';

const zoomToggleClass = '.map-settings__list-item_checkbox .switch';

export class ZoomToggle extends Component {
    constructor(parent) {
        super(parent);

        this.enabled = false;
        this.state = 0;

        this.prepareDOMElements();
    }


    prepareDOMElements() {
        const self = this;
        this.zoomToggle = $(zoomToggleClass); 
        this.zoomToggle.on("click", e => {
            // TODO need to figure out why there are two clicks
            // currently ignoring the second click
            if (this.state == 0){
                this.state = 1
                self.enabled = !self.enabled;
                console.log(`Zoom is ${self.enabled}`)
                self.triggerEvent("zoomToggled", self);
            } else if (this.state == 1) {
                this.state = 0;
            }
        });
    }
}
