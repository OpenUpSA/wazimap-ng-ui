import {Observable} from '../utils';

const dropDownLabelClass = '.w-dropdown-toggle div:nth-child(2)';
const dropDownLinkClass = '.w-dropdown-list .dropdown-link';
const dropDownClass = '.w-dropdown-list';

export class PreferredChildToggle extends Observable {
    constructor(childLevel='mainplace') {
        super();
        this.level = childLevel;

        this.prepareDOMElements();
    }


    prepareDOMElements() {
        const self = this;
        this.childToggle = $(dropDownLinkClass); 
        this.childToggle.on('click', e => {
            const target = e.target;

            // TODO remove SA specific stuff
            let level = 'mainplace';
            if (target.text.indexOf('Ward') >= 0)
                level = 'ward';

            $(dropDownLinkClass).removeClass("active")
            $(target).addClass("active")
            $(dropDownLabelClass).text(e.target.text)
            $(dropDownClass).removeClass('w--open');


            self.triggerEvent('preferredChildChange', level)
        });
    }
}