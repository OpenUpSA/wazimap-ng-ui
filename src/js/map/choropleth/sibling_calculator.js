import {percFmt, numFmt} from '../../utils'

export default class SiblingCalculator {
    calculate(childData, primaryGroup, selectedSubindicator) {
        let sumData = {};
        Object.entries(childData).map(([code, data]) => {
            let filteredArr = data.filter((a) => {
                return a[primaryGroup] === selectedSubindicator;
            });

            sumData[code] = filteredArr.reduce(function (s, a) {
                return s + parseFloat(a.count);
            }, 0);
        })

        const universe = Object.entries(sumData).reduce((total, c) => {
            return total + c[1];
        }, 0)

        const result = Object.entries(sumData).map(childGeography => {
            const code = childGeography[0];
            const count = childGeography[1];
            const val = count / universe;
            return {code: code, val: val};
        })

        return result
    }

    format(x) {
        return percFmt(x);
    }
}
