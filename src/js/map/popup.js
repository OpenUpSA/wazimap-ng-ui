import {Component, setPopupStyle, formatNumericalValue} from '../utils';
import {format as d3format} from "d3-format/src/defaultLocale";

const PERCENTAGE_TYPE = 'Percentage';
const VALUE_TYPE = 'Value'
const POPUP_OFFSET = [20, 0];

/**
 * this class creates & manipulates the popup over the map
 */
export class Popup extends Component {
    constructor(parent, formattingConfig, map) {
        super(parent);

        this.map = map;
        this.formattingConfig = formattingConfig;
        this.choroplethMethods = {
            subindicator: 'subindicator',
            sibling: 'sibling',
            absolute: 'absolute_value'
        }

        this.prepareDomElements();
    }

    prepareDomElements = () => {
        this.map.map_variables.tooltipItem = $(this.map.map_variables.tooltipClsName)[0].cloneNode(true);
    }

    loadPopup(payload, state) {
        const popupContent = this.createPopupContent(payload, state);

        this.map.map_variables.popup = L.popup({
            autoPan: false,
            offset: POPUP_OFFSET,
            closeButton: false
        })

        this.map.map_variables.popup
            .setLatLng(payload.element.latlng)
            .setContent(popupContent)
            .openOn(this.map);

        //openOn -> closes with map.closePopup()
        //addTo -> doesnt close with map.closePopup()

        setPopupStyle('map-tooltip')
    }

    updatePopupPosition(payload) {
        if (this.map.map_variables.popup === null) {
            this.loadPopup(payload.payload.layer, payload.state);
        } else {
            payload.payload.popup.setLatLng(payload.payload.layer.element.latlng);
        }
    }

    hidePopup(payload) {
        this.map.closePopup();
    }

    createPopupContent = (payload, state) => {
        let item = this.map.map_variables.tooltipItem.cloneNode(true);
        if (state.subindicator !== null) {
            this.modifyTooltipHtml(item, state.subindicator.choropleth_method, state.profile.geometries.boundary.properties.name);
        }

        this.map.map_variables.hoverAreaLevel = payload.properties.level;
        this.map.map_variables.hoverAreaCode = payload.layer.feature.properties.code;

        $('.map-tooltip__name div', item).text(payload.properties.name);
        $('.map-tooltip__geography-chip div', item).text(this.map.map_variables.hoverAreaLevel);
        const areaCode = payload.areaCode;

        this.setTooltipSubindicators(payload, state, item, areaCode);
        this.setTooltipThemes(item, areaCode);

        $(item).find('.tooltip__notch').remove();   //leafletjs already creates this

        return item;
    }

    modifyTooltipHtml(item, choroplethMethod, currentGeo) {
        $('.tooltip__value_wrapper .tooltip__value_detail', item).remove();

        let wrapperClone = $('.map-tooltip__value .tooltip__value_wrapper', item)[0].cloneNode(true);
        if (choroplethMethod !== this.choroplethMethods.absolute) {
            $(wrapperClone).css('width', '85%');
            $(wrapperClone).css('float', 'left');
        }

        let label = document.createElement('div');
        $(label).addClass('tooltip-label');
        $(label).css('width', '15%');
        $(label).css('float', 'left');
        $(label).css('text-align', 'left');
        $(label).css('color', '#707070');
        $(label).css('padding', '2px 6px');
        $(label).text('or');

        let parentTop = document.createElement('div');
        $(parentTop).append(wrapperClone);
        if (choroplethMethod !== this.choroplethMethods.absolute) {
            $(parentTop).append(label);
        }

        let parentBottom = parentTop.cloneNode(true);
        $(parentBottom).css('margin-top', '3px');
        $(parentBottom).find('.tooltip-label').css('width', '75%');
        if (choroplethMethod === this.choroplethMethods.subindicator) {
            $(parentBottom).find('.tooltip-label').text('of all categories');
        } else {
            $(parentBottom).find('.tooltip-label').text(`of total for ${currentGeo}`);
        }
        $(parentBottom).find('.tooltip__value_amount').addClass('percentage-value');
        $(parentBottom).find('.tooltip__value_wrapper').css('width', '25%');

        $('.map-tooltip__value .tooltip__value_wrapper', item).replaceWith(parentTop);
        if (choroplethMethod !== this.choroplethMethods.absolute) {
            $('.map-tooltip__value', item).append(parentBottom);
        }
    }

    setTooltipThemes = (item, areaCode) => {
        $(item).find('.map-tooltip__points').empty();
    }

    setTooltipSubindicators = (payload, state, item, areaCode) => {
        let formattingConfig = this.formattingConfig;
        if (state.choroplethData !== null && typeof state.choroplethData !== 'undefined') {
            //if any subindicator selected
            let isChild = false;
            for (let i = 0; i < state.choroplethData.length; i++) {
                if (state.choroplethData[i].code === areaCode) {
                    isChild = true;
                    if (state.subindicator && state.subindicator.config.chartConfiguration) {
                        let chartConfig = state.subindicator.config.chartConfiguration;
                        let percentageFormatting = chartConfig.types[PERCENTAGE_TYPE].formatting;
                        let absoluteFormatting = chartConfig.types[VALUE_TYPE].formatting;

                        const countFmt = d3format(absoluteFormatting)(state.choroplethData[i].total);
                        const perc = d3format(percentageFormatting)(state.choroplethData[i].val);

                        $('.map-tooltip__value', item).removeClass('hidden');
                        $('.map-tooltip__value .tooltip__value_label div', item).text(`${state.subindicator.indicatorTitle} (${state.selectedSubindicator})`);
                        $('.map-tooltip__value .tooltip__value_amount div', item).text(countFmt);
                        if (state.subindicator.choropleth_method !== this.choroplethMethods.absolute) {
                            $('.map-tooltip__value .percentage-value', item).text(`(${perc})`);
                        } else {
                            $('.map-tooltip__value .percentage-value', item).text('');
                        }
                    }
                }
            }

            if (!isChild) {
                $(item).find('.map-tooltip__value').remove();
            }
        } else {
            $(item).find('.map-tooltip__value').remove();
        }
    }
}
