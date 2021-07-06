import {IndicatorHelper} from '../src/js/dataobjects';
import {defaultValues} from '../src/js/defaultValues';
import {ContentBlock} from '../src/js/profile/blocks/content_block';

describe('Test IndicatorHelper static methods', () => {
    test('missing data is correctly fixed', () => {
        let indicator = {}
        indicator.metadata = IndicatorHelper.getMetadata(indicator)

        expect(indicator.metadata.source).toBe('')
        expect(indicator.metadata.description).toBe('')
        expect(indicator.metadata.url).toBe(null)
        expect(indicator.metadata.licence.name).toBe('')
        expect(indicator.metadata.licence.url).toBe(null)
    })

    test('missing configuration values inserted', () => {
        const original = defaultValues.chartConfiguration
        defaultValues.chartConfiguration = {test1: 1, test2: 2}

        let chartConfiguration = {test1: 3}
        let chartConfiguration2 = IndicatorHelper.getChartConfiguration(chartConfiguration)

        expect(chartConfiguration2).toBeDefined()
        expect(chartConfiguration2.test1).toBe(3)
        expect(chartConfiguration2.test2).toBe(2)

        defaultValues.chartConfiguration = original;
    })

    test('fix indicator applies all manipulations to indicator', () => {
        const original = defaultValues.chartConfiguration
        defaultValues.chartConfiguration = {test1: 1, test2: 2, test3: {test4: 4}}
        
        let indicator = {}
        indicator.type = ContentBlock.BLOCK_TYPES.Indicator
        indicator = IndicatorHelper.fixIndicator('', indicator)

        expect(indicator.metadata.source).toBe('')
        expect(indicator.metadata.description).toBe('')
        expect(indicator.metadata.licence.name).toBe('')
        expect(indicator.metadata.licence.url).toBe(null)
        expect(indicator.chartConfiguration).toBeDefined()
        expect(indicator.chartConfiguration.test1).toBe(1)
        expect(indicator.chartConfiguration.test2).toBe(2)
        expect(indicator.chartConfiguration.test3.test4).toBe(4)

        defaultValues.chartConfiguration = original;
    })
})
