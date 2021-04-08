import {numFmt, filterAndSumGeoCounts} from '../../utils'

export default class AbsoluteValueCalculator {
    constructor() {}
    calculate(childData, primaryGroup, selectedSubindicator) {
        let sumData = filterAndSumGeoCounts(childData, primaryGroup, selectedSubindicator);

        const result = Object.entries(sumData).map(childGeography => {
            const code = childGeography[0];
            const count = childGeography[1];
            return {code: code, val: count};
        })

        return result
    }

    format(x) {
        return numFmt(x);
    }
}
