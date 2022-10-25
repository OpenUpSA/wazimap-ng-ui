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
            subindicator: {
                type: 'subindicator',
                cssClass: 'sub-indicator-type',
                bottomText: 'of all categories'
            },
            sibling: {
                type: 'sibling',
                cssClass: 'sibling-type',
                bottomText: 'of total for shaded areas'
            },
            absolute_value: {
                type: 'absolute_value',
                cssClass: 'absolute-type',
                bottomText: ''
            }
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
            this.modifyTooltipHtml(item, state.subindicator.choropleth_method);
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

    modifyTooltipHtml(item, choroplethMethod) {
        let wrapperClone = $('.map-tooltip__value .tooltip__value_wrapper', item)[0].cloneNode(true);
        let wrapperClone2 = $('.map-tooltip__value .tooltip__value_wrapper', item)[0].cloneNode(true);

        //top
        let tooltipRowTop = document.createElement('div');
        $(tooltipRowTop).addClass('tooltip-row-top').addClass(this.choroplethMethods[choroplethMethod].cssClass);

        let tooltipLabel = document.createElement('div');
        $(tooltipLabel).addClass('tooltip-label');
        $(tooltipLabel).text('or');

        $(tooltipRowTop).append(wrapperClone);
        $(tooltipRowTop).find('.tooltip__value_detail').remove();
        $(tooltipRowTop).append(tooltipLabel);

        //bottom
        let tooltipRowBottom = document.createElement('div');
        $(tooltipRowBottom).addClass('tooltip-row-bottom').addClass(this.choroplethMethods[choroplethMethod].cssClass);

        let tooltipLabel2 = document.createElement('div');
        $(tooltipLabel2).addClass('tooltip-label');
        $(tooltipLabel2).text(this.choroplethMethods[choroplethMethod].bottomText);

        $(wrapperClone2).find('.tooltip__value_detail').addClass('percentage-value');
        $(tooltipRowBottom).append(wrapperClone2).find('.tooltip__value_amount').remove();
        $(tooltipRowBottom).append(tooltipLabel2);

        //parent
        $('.map-tooltip__value .tooltip__value_wrapper', item).replaceWith(tooltipRowTop);
        if (choroplethMethod !== this.choroplethMethods.absolute_value.type) {
            $(tooltipRowBottom).insertAfter(tooltipRowTop);
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
                            $('.map-tooltip__value .percentage-value', item).text(`${perc}`);
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
