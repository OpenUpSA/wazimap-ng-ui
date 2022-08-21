import {Component} from "../../utils";

export class SubIndicator extends Component {
    constructor(parent, isLoading, text, subIndicatorCallback, parentNames) {
        super(parent);

        this._element = $($($('.styles .data-category__h2')[1])
            .find('.data-category__h3')[0])
            .find('.data-category__h4')[0].cloneNode(true);  //[0] -> v1  ---  [1] -> v2
        this._wrapper = $(this.parent.element).find('.data-category__h3_wrapper');
        this._callback = subIndicatorCallback;
        this._parentNames = parentNames;

        this.text = text;   //set the html too
        this.isLoading = isLoading;

        this.prepareDomElements();
        this.addElementToWrapper();
    }

    get element() {
        return this._element;
    }

    get text() {
        return this._text;
    }

    set text(value) {
        this._text = value;
        $('div.truncate', this.element).text(value);
    }

    get wrapper() {
        return this._wrapper;
    }

    get callback() {
        return this._callback;
    }

    get parentNames() {
        return this._parentNames;
    }

    get choroplethMethod() {
        return this.parent.choroplethMethod;
    }

    get isLoading() {
        return this._isLoading;
    }

    set isLoading(value) {
        this._isLoading = value;
    }

    get versionData() {
        return this.parent.versionData;
    }

    prepareDomElements() {
        if (this.isLoading) {
            this.text = 'Loading...';
            $(this.element).find('.data-category__h4_loading').removeClass('hidden');
        } else {
            $(this.element).on("click", (el) => {
                if (this.callback !== undefined) {
                    this.callback({
                        indicatorTitle: this.parentNames.indicator,
                        selectedSubindicator: this.text,
                        parents: this.parentNames,
                        choropleth_method: this.choroplethMethod,
                        indicatorId: this.parent.id,
                        indicatorData: this.parent.childData,
                        versionData: this.versionData,
                        metadata: this.parent.metadata,
                        config: {
                            choroplethRange: this.parent.choroplethRange,
                            enableLinearScrubber: this.parent.enableLinearScrubber,
                            chartConfiguration: this.parent.chartConfiguration
                        }
                    })
                }
            });
        }
    }

    addElementToWrapper() {
        $(this.wrapper).append($(this.element));
    }
}