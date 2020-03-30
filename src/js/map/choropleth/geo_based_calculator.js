export function GeoBasedCalculator(subindicator) {
    let result = Object.entries(subindicator.obj.children).map(childGeography => {
        const code = childGeography[0];
        const count = childGeography[1];
        const universe = subindicator.subindicators.reduce((el1, el2) => {
            if (el2.children != undefined && el2.children[code] != undefined)
                return el1 + el2.children[code];
        }, 0)
        const val = count / universe;
        return {code: code, val: val};
    })

    return result;
}
