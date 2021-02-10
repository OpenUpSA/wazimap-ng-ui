import {percFmt, numFmt} from '../../utils'

export default class SubindicatorCalculator {
    calculate(args) {
        if (typeof args.data === 'undefined') {
            return null;
        }

        const result = Object.entries(args.data).map(([code, codeValue]) => {
            const sumSubindicatorsValueForCode = args.subindicatorArr.reduce((sum, subindicator) => {
                let childrenValue = subindicator.children[code] || 0;
                return sum + childrenValue;
            }, 0);

            const percentage = codeValue / sumSubindicatorsValueForCode;

            return {code: code, val: percentage};
        })

        return result;
    }

    format(x) {
        return percFmt(x);
    }
}
