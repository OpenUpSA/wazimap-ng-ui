import {getJSON, numFmt, Observable} from "../utils";

/**
 * this class creates & manipulates the popup over the map
 */
export class Popup extends Observable {
    constructor(_map) {
        super();

        this.map = _map;
        this.prepareDomElements();
    }

    prepareDomElements = () => {
        this.map.map_variables.tooltipItem = $(this.map.map_variables.tooltipClsName)[0].cloneNode(true);
    }

    loadPopup(payload) {
        this.map.map_variables.popup = L.popup({
            autoPan: false
        })

        const popupContent = this.createPopupContent(payload);

        this.map.map_variables.popup.setLatLng(payload.payload.element.latlng)
            .setContent(popupContent)
            .openOn(this.map);
    }

    updatePopupPosition(payload) {
        payload.payload.popup.setLatLng(payload.payload.layer.element.latlng).openOn(this.map);
    }

    hidePopup(payload) {
        this.map.closePopup();
    }

    createPopupContent = (payload) => {
        let item = this.map.map_variables.tooltipItem.cloneNode(true);

        const state = payload.state;
        this.map.map_variables.hoverAreaLevel = payload.payload.properties.level;
        this.map.map_variables.hoverAreaCode = payload.payload.layer.feature.properties.code;

        $('.map__tooltip_name .text-block', item).text(payload.payload.properties.name);
        $('.map__tooltip_geography-chip', item).text(this.map.map_variables.hoverAreaLevel);
        var areaCode = payload.payload.areaCode;

        if (state.subindicator != null) {
            //if any subindicator selected
            const subindicators = state.subindicator.subindicators;
            const subindicator = state.subindicator.obj.key;
            const subindicatorValues = subindicators.filter(s => (s.key == subindicator));

            if (subindicatorValues.length > 0) {

                if (typeof subindicators[0].children !== 'undefined' && typeof subindicators[0].children[this.map.map_variables.hoverAreaCode] !== 'undefined') {
                    const subindicatorValue = subindicatorValues[0];
                    if (subindicatorValue != undefined && subindicatorValue.children != undefined) {
                        for (const [geographyCode, count] of Object.entries(subindicatorValue.children)) {
                            if (geographyCode == areaCode) {
                                const countFmt = numFmt(count);
                                const perc = (payload.payload.layer.feature.properties.percentage * 100).toFixed(2);

                                $('.map__tooltip_value .tooltip__value_label .truncate', item).text(`${state.subindicator.indicator} (${subindicatorValue.label})`);
                                $('.map__tooltip_value .tooltip__value_amount .truncate', item).text(countFmt);
                                $('.map__tooltip_value .tooltip__value_detail .truncate', item).text(`(${perc} %)`);
                            }
                        }
                    }
                } else {
                    $(item).find('.map__tooltip_value').remove();
                }
            }
        } else {
            $(item).find('.map__tooltip_value').remove();
        }

        return $(item).html();
    }
}
