//import {Observable} from './utils';

/**
 * Keeps track of hiding or showing a spinner
 */
export class LoadingSpinner {
    constructor(spinnerDOM, SpinnerState = { start: false, stop: false}) {
		this.spinnerObject = $(spinnerDOM);
		
		if(SpinnerState.start)
			this.start();
		else if(SpinnerState.stop)
			this.stop();
    }
	
	start(){
		this.spinnerObject.show();
	}

	stop(){
		this.spinnerObject.hide();
	}

}