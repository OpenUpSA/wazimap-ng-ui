import {schemeBlues as d3schemeBlues} from 'd3-scale-chromatic';

const DEFAULT_CONFIG = 'default'
let chartConfiguration = {
    types: {
        Value: {formatting: '~s', minX: DEFAULT_CONFIG, maxX: DEFAULT_CONFIG},
        Percentage: {formatting: '.0%', minX: DEFAULT_CONFIG, maxX: DEFAULT_CONFIG}
    },
    disableToggle: false,
    defaultType: 'Percentage', // [Value|Percentage]
    xTicks: null
};

const choroplethConfig = {
    colors: d3schemeBlues[5],
    positive_color_range: ["#eff3ff", "#08519c"],
    negative_color_range: ["#b30000", "#fef0d9"],
    zero_color: '#eeeeee',
    opacity: 0.7,
    opacity_over: 0.8
}

export const defaultValues = {
    chartConfiguration,
    choroplethConfig,
    DEFAULT_CONFIG
}
