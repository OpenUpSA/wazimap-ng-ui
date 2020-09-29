import {validation as v} from './utils';

let chartConfiguration = [{"label": "Value", "formatting": ",.3d"}];

function checkAny(x, defaultVal) {
    if (v.isMissingData(x))
        return defaultVal;
    return x;
}


export const defaults = {
    checkAny
}

export const defaultValues = {
    chartConfiguration
}