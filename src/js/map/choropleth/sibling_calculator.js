import {percFmt, filterAndSumGeoCounts} from '../../utils'

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

    format(x) {
        return percFmt(x);
    }
}
