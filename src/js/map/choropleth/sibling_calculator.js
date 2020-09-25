import {percFmt, numFmt} from '../../utils'

export default class SiblingCalculator {
    calculate(args) {
        if (typeof args.data === 'undefined'){
            return null;
        }

        const universe = Object.entries(args.data).reduce((total, c) => {
            return total + c[1];
        }, 0)


        const result = Object.entries(args.data).map(childGeography => {
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
