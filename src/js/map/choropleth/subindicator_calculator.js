import {percFmt, numFmt} from '../../utils'

export default class SubindicatorCalculator {
    calculate(childData, primaryGroup, selectedSubindicator) {
        const result = Object.entries(childData).map(([code, data]) => {
            let filteredArr = data.filter((a) => {
                return a[primaryGroup] === selectedSubindicator;
            });

            const sum = filteredArr.reduce(function (s, a) {
                return s + parseFloat(a.count);
            }, 0);

            const total = data.reduce(function (s, a) {
                return s + parseFloat(a.count);
            }, 0);

            const percentage = sum / total;

            return {code: code, val: percentage, total : sum};
        })

        return result;
    }

    format(x) {
        return percFmt(x);
    }
}
