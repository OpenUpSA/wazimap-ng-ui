import {IndicatorHelper} from '../src/js/dataobjects';
import {defaultValues} from '../src/js/defaultValues';

describe('Test IndicatorHelper static methods', () => {
    test('missing data is correctly fixed', () => {
        let indicator = {}
        indicator = IndicatorHelper.fixMetadata(indicator)

        expect(indicator.metadata.source).toBe('')
        expect(indicator.metadata.description).toBe('')
        expect(indicator.metadata.licence.name).toBe('')
        expect(indicator.metadata.licence.url).toBe('')
    })

    test('missing configuration values inserted', () => {
        const original = defaultValues.chartConfiguration
        defaultValues.chartConfiguration = {test1: 1, test2: 2}

        let indicator = {test1: 3}

        indicator = IndicatorHelper.addDefaultConfiguration(indicator)
        expect(indicator.chartConfiguration).toBeDefined()
        expect(indicator.chartConfiguration.test1).toBe(1)
        expect(indicator.chartConfiguration.test2).toBe(2)

        defaultValues.chartConfiguration = original;
    })

    test('fix indicator applies all manipulations to indicator', () => {
        const original = defaultValues.chartConfiguration
        defaultValues.chartConfiguration = {test1: 1, test2: 2}
        
        let indicator = {}
        indicator = IndicatorHelper.fixIndicator(indicator)

        expect(indicator.metadata.source).toBe('')
        expect(indicator.metadata.description).toBe('')
        expect(indicator.metadata.licence.name).toBe('')
        expect(indicator.metadata.licence.url).toBe('')
        expect(indicator.chartConfiguration).toBeDefined()
        expect(indicator.chartConfiguration.test1).toBe(1)
        expect(indicator.chartConfiguration.test2).toBe(2)

        defaultValues.chartConfiguration = original;
    })
})
