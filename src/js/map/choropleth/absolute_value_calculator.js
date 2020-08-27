import {percFmt, numFmt} from '../../utils'

export default class AbsoluteValueCalculator {
    constructor() {}
    calculate(args) {
        const result = Object.entries(args.data).map(childGeography => {
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
