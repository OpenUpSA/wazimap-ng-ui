import {filterAndSumGeoCounts} from '../../utils';
import {format as d3format} from "d3-format/src/defaultLocale";

export default class AbsoluteValueCalculator {
    constructor() {}
    calculate(childData, primaryGroup, selectedSubindicator) {
        let sumData = filterAndSumGeoCounts(childData, primaryGroup, selectedSubindicator);

        const result = Object.entries(sumData).map(childGeography => {
            const code = childGeography[0];
            const count = childGeography[1];
            return {code: code, val: count, total: count};
        })

        return result
    }

    format(val, config) {
        let absoluteFormatting = config.types["Value"].formatting;
        return d3format(absoluteFormatting)(val);
    }
}
