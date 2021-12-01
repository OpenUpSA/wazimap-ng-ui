import {Component, formatNumericalValue} from "../utils";

export class KeyMetric extends Component {
    constructor(parent, data, cloneTemplate, wrapper) {
        super(parent);

        this._metricData = data;
        this._wrapper = wrapper;
        this._cloneTemplate = cloneTemplate;
        this._element = this._cloneTemplate.cloneNode(true);

        this.append();

        this.prepareEvents();
    }

    get metricData() {
        return this._metricData;
    }

    get wrapper() {
        return this._wrapper;
    }

    get formattingConfig() {
        return this.parent.formattingConfig;
    }

    get metricVersion() {
        return this._metricData.version_data;
    }

    get element() {
        return this._element;
    }

    updateVersionNotification() {
        if (this.metricVersion.model.isActive) {
            $('.key-metric__description', this.element).addClass('hidden');
        } else {
            $('.key-metric__description', this.element).removeClass('hidden');
            $('.key-metric__description div', this.element).text(`(${this.metricVersion.model.name})`);
        }
    }

    prepareEvents() {
        this.parent.on('version.updated', (activeVersion) => {
            this.updateVersionNotification();
        });
    }

    append() {
        $('.key-metric__value div', this.element).text(formatNumericalValue(this.metricData.value, this.formattingConfig, this.metricData.method));
        $('.key-metric__title', this.element).text(this.metricData.label);

        this.wrapper.append(this.element);
    }
}