export function SubindicatorCalculator(args) {
    const result = Object.entries(args.data).map(childGeography => {
        const code = childGeography[0];
        const count = childGeography[1];
        const universe = args.subindicatorArr.reduce((el1, el2) => {
            if (el2.children != undefined && el2.children[code] != undefined)
                return el1 + el2.children[code];
        }, 0)
        const val = count / universe;
        return {code: code, val: val};
    })

    return result;
}
