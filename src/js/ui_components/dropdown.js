import {Component, Observable} from "../../utils";


export class DropdownModel extends Observable {
    static EVENTS = {
        update: 'DropdownModel.update',     // triggered when new items are added or removed
        selected: 'DropdownModel.selected', // triggered when a new item is selected
        enabled: 'DropdownModel.enabled',   // triggered when the dropdown is set to enabled
        disabled: 'DropdownModel.disabled', // triggered when the dropdown is set to disabled
    }

    constructor(items = [], currentIndex = 0, isDisabled = false) {
        super();

        this._items = items;
        this._currentIndex = currentIndex;
        this._isDisabled = isDisabled
    }

    get items() {
        return this._items;
    }

    get currentIndex() {
        return this._currentIndex;
    }

    set currentIndex(idx) {
        this._currentIndex = idx;
        this.triggerEvent(DropdownModel.EVENTS.selected, this)
    }

    get currentItem() {
        return this._items[this.currentIndex]
    }

    set currentItem(value) {
        for (let idx in this.items) {
            let item = this.items[idx];
            if (item == value) {
                this.currentIndex = idx;
                return;
            }
        }

        console.error(`Did not find value: ${value} in dropdown items`);
    }

    get isDisabled() {
        return this._isDisabled;
    }

    set isDisabled(flag) {
        this._isDisabled = flag;

        if (flag) {
            this.triggerEvent(DropdownModel.EVENTS.disabled);
        } else {
            this.triggerEvent(DropdownModel.EVENTS.enabled);
        }
    }

    getIndexForValue(value) {
        return this.items.indexOf(value);
    }

    setIndexUsingValue(value) {
        let index = this.getIndexForValue(value);
        this.currentIndex = index;
    }

    updateItems(items, currentIndex = 0) {
        this._items = items;
        this._currentIndex = currentIndex;
        this.triggerEvent(DropdownModel.EVENTS.update, this);
    }
}


export class Dropdown extends Component {
    /**
     * A class representing a dropdown widget
     */

    static EVENTS = {}

    constructor(parent, container, items, defaultText = '', disabled = false) {
        super(parent);
        this._container = container;
        this._model = new DropdownModel(items, 0);
        this._defaultText = defaultText;
        this._listItemElements = [];


        this.prepareDomElements();
        this.prepareEvents();

        this.redrawItems(this.model.items);
        this.model.isDisabled = disabled;
        this.setText(defaultText)

    }

    get container() {
        return this._container;
    }

    get model() {
        return this._model;
    }

    prepareDomElements() {
        this._ddWrapper = $(this.container).find('.dropdown-menu__content')[0];
        $(this.container).find('.dropdown__list_item').hide();
        this._listItem = $(this.container).find('.dropdown__list_item')[0].cloneNode(true);

        this._selectedItem = $(this.container).find('.dropdown-menu__selected-item .truncate');
        this._trigger = $(this.container).find('.dropdown-menu__trigger')[0]
    }

    prepareEvents() {
        this.prepareModelEvents();
        this.prepareUIEvents();
    }

    prepareModelEvents() {
        const self = this;

        this.model.on(DropdownModel.EVENTS.update, model => {
            self.redrawItems(model.items);
        })

        this.model.on(DropdownModel.EVENTS.selected, () => {
            self.updateSelectedText();
        })

        this.model.on(DropdownModel.EVENTS.disabled, () => self.disable())
        this.model.on(DropdownModel.EVENTS.enabled, () => self.enable())
    }

    prepareUIEvents() {
        const self = this;

        $(this._trigger).on('click', () => {
            self.showItems();
        })
    }

    showItems() {
        $(this._ddWrapper).show()
    }

    hideItems() {
        $(this._ddWrapper).hide()
    }

    updateItems(items, currentIndex = 0) {
        this.model.updateItems(items, currentIndex);
    }

    reset() {
        this._listItemElements.forEach(el => {
            $(el).remove();
        })

        this._listItemElements = [];
    }

    updateSelectedText() {
        this.setText(this.model.currentItem);
    }

    setSelected(idx) {
        this.model.currentIndex = idx;
        this.setText(this.model.currentItem);
    }

    setText(text) {
        $(this._selectedItem).text(text)
    }

    enable() {
        $(this._trigger).removeClass('is--disabled');
        $(this.container).removeClass('disabled');
    }

    disable() {
        $(this._trigger).addClass('is--disabled');
        $(this.container).addClass('disabled');
    }

    redrawItems(items) {
        const self = this;

        this.reset();

        items.forEach((item, idx) => {
            let li = self._listItem.cloneNode(true);

            $(li).removeClass("selected");
            $('.truncate', li).text(item);
            $(li).off('click');
            $(li).on('click', () => {
                self.setSelected(idx)
                self.hideItems();
                $(this).addClass("selected");
            })
            $(self._ddWrapper).append(li);
            $(li).show();
            self._listItemElements.push(li);
        })
    }
}