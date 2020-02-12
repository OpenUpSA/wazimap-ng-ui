//import {Observable} from './utils';

let removeClsName = 'hide';

/**
 * Keeps track of hiding or showing a spinner
 */
export class LoadingSpinner {
    constructor(spinnerDOM, SpinnerState = {start: false, stop: false}, useHideClass = false) {
        this.spinnerObject = $(spinnerDOM);
        this.useHideClass = useHideClass;
        this.spinnerDOM = spinnerDOM;

        if (SpinnerState.start)
            this.start();
        else if (SpinnerState.stop)
            this.stop();
    }

    start() {
        if (this.useHideClass) {
            $(this.spinnerDOM).removeClass(removeClsName);
        } else {
            this.spinnerObject.show();
        }
    }

    stop() {
        if (this.useHideClass) {
            if (!this.spinnerObject.hasClass(removeClsName)) {
                $(this.spinnerDOM).addClass(removeClsName);
            }
        } else {
            this.spinnerObject.hide();
        }
    }

}
