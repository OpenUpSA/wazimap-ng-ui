import {percFmt, numFmt} from '../../utils'

export default class SubindicatorCalculator {
    calculate(args) {
        if (typeof args.data === 'undefined'){
            return null;
        }

        const result = Object.entries(args.data).map(childGeography => {
            const code = childGeography[0];
            const count = childGeography[1];
            const universe = args.subindicatorArr.reduce((el1, el2) => {
                if (el2.children != undefined && el2.children[code] != undefined) {
                    let e1 = typeof el1 === 'undefined' ? 0 : el1;
                    let e2 = typeof  el2.children[code] === 'undefined' ? 0 :  el2.children[code];
                    let total = e1 + e2;

                    return total;
                }
            }, 0);

            const val = count / universe;
            return {code: code, val: val};
        })

        return result;
    }

    format(x) {
        return percFmt(x);
    }
}
