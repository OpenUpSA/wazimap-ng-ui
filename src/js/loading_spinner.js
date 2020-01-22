//import {Observable} from './utils';

/**
 * Keeps track of hiding or showing a spinner
 */
export class LoadingSpinner /*extends Observable*/ {
    constructor(spinnerDOM) {
		//super();
		this.spinnerDOM = spinnerDOM;
		this.hideSpinner();
    }
	
	show(){
		$(this.spinnerDOM).show();
	}

	hide(){
		$(this.spinnerDOM).hide();
	}

}