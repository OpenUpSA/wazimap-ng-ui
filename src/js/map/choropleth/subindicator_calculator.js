import {percFmt, numFmt} from '../../utils'

export default class SubindicatorCalculator {
    calculate(childData) {

        const key = 'age group';
        const val = '00-04';

        const result = Object.entries(childData).map(([code, data]) => {
            let filteredArr = data.filter((a) => {
                return a[key] === val;
            });

            const sum = filteredArr.reduce(function (s, a) {
                return s + a.count;
            }, 0);

            const total = data.reduce(function (s, a) {
                return s + a.count;
            }, 0);

            const percentage = sum / total;

            return {code: code, val: percentage};
        })

        return result;
    }

    format(x) {
        return percFmt(x);
    }
}
