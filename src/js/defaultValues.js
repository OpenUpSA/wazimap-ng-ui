const DEFAULT_CONFIG = 'default'
let chartConfiguration = {
    types: {
        Value: {formatting: '~s', minX: DEFAULT_CONFIG, maxX: DEFAULT_CONFIG},
        Percentage: {formatting: '.0%', minX: DEFAULT_CONFIG, maxX: DEFAULT_CONFIG}
    },
    disableToggle: false,
    defaultType: 'Percentage' // [Value|Percentage]
};
export const defaultValues = {
    chartConfiguration,
    DEFAULT_CONFIG
}
