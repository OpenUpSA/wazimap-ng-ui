const DEFAULT_CONFIG = 'default'
let chartConfiguration = {
    types: {
        Value: {formatting: '~s', minX: DEFAULT_CONFIG, maxX: DEFAULT_CONFIG, disabled: false},
        Percentage: {formatting: '.0%', minX: DEFAULT_CONFIG, maxX: DEFAULT_CONFIG, disabled: false}
    },
    defaultType: 'Value' // [Value|Percentage]
};
export const defaultValues = {
    chartConfiguration,
    DEFAULT_CONFIG
}
