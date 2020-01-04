import {select as d3select} from 'd3-selection';

export function onSubIndicatorChange(payload) {
    var label = `${payload.indicator} (${payload.obj.key})`
    updateSubIndicatorChip(label);
}

export function updateSubIndicatorChip(subIndicatorLabel) {
    var container = d3select(".content__map");
    container.select(".chip--map .truncate").text(subIndicatorLabel);
}

