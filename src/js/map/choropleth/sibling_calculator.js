import {filterAndSumGeoCounts} from '../../utils';
import {format as d3format} from "d3-format/src/defaultLocale";

export default class SiblingCalculator {
    calculate(childData, primaryGroup, selectedSubindicator) {
        let sumData = filterAndSumGeoCounts(childData, primaryGroup, selectedSubindicator);

        const universe = Object.entries(sumData).reduce((total, c) => {
            return total + c[1];
        }, 0)

        const result = Object.entries(sumData).map(childGeography => {
            const code = childGeography[0];
            const count = childGeography[1];
            const val = count / universe;
            return {code: code, val: val, total: count};
        })

        return result
    }

    format(val, config) {
      let percentageFormatting = config.types["Percentage"].formatting;
      return d3format(percentageFormatting)(val);
    }
}
