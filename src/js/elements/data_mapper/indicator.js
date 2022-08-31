import {Component} from "../../utils";
import {SubIndicator} from "./subindicator";

export class Indicator extends Component {
    constructor(parent,
                text,
                id,
                choroplethMethod,
                primaryGroup,
                versionData,
                metadata,
                choroplethRange,
                enableLinearScrubber,
                chartConfiguration) {
        super(parent);

        this._element = $($('.styles .data-category__h2')[1])
            .find('.data-category__h3')[0].cloneNode(true);  //[0] -> v1  ---  [1] -> v2
        this._wrapper = $(this.parent.element).find('.data-category__h2_wrapper');
        this._id = id;
        this._primaryGroup = primaryGroup;
        this._choroplethMethod = choroplethMethod;
        this._versionData = versionData;
        this._metadata = metadata;
        this._choroplethRange = choroplethRange;
        this._enableLinearScrubber = enableLinearScrubber;
        this._chartConfiguration = chartConfiguration;

        this.text = text;   //set the html too
        this.isExpanded = false;

        this.prepareDomElements();
        this.addElementToWrapper();

        this.isLoading = true;
    }

    get text() {
        return this._text;
    }

    set text(value) {
        this._text = value;
        $('.data-category__h3_trigger--v2 div.truncate', this.element).text(value);
    }

    get element() {
        return this._element;
    }

    get wrapper() {
        return this._wrapper;
    }

    get isLoading() {
        return this._isLoading;
    }

    set isLoading(value) {
        this._isLoading = value;
        if (value) {
            new SubIndicator(this, true);
        } else {
            this.clear();
        }
    }

    get isExpanded() {
        return this._isExpanded;
    }

    set isExpanded(value) {
        if (value) {
            $(this.element).find('.data-category__h3_content--v2').removeClass('is--closed');
        } else {
            $(this.element).find('.data-category__h3_content--v2').addClass('is--closed');
        }

        this._isExpanded = value;
    }

    get id() {
        return this._id;
    }

    get primaryGroup() {
        return this._primaryGroup;
    }

    get choroplethMethod() {
        return this._choroplethMethod;
    }

    get childData() {
        return this._childData;
    }

    set childData(value) {
        this._childData = value;
    }

    get versionData() {
        return this._versionData;
    }

    get metadata() {
        return this._metadata;
    }

    get choroplethRange() {
        return this._choroplethRange;
    }

    get enableLinearScrubber() {
        return this._enableLinearScrubber;
    }

    get chartConfiguration() {
        return this._chartConfiguration;
    }

    prepareDomElements() {
        $(this.element).find('.data-category__h3_trigger--v2').on('click', () => {
            this.isExpanded = !this.isExpanded;
        })

        this.clear();
    }

    addElementToWrapper() {
        $(this.wrapper).append($(this.element));
    }

    clear() {
        $(".data-category__h4", this.element).remove();
    }
}