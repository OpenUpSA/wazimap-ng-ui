export function SiblingCalculator(subindicator) {

    const result = Object.entries(subindicator.obj.children).map(childGeography => {
        const code = childGeography[0];
        const count = childGeography[1];
        let universe = 0;
        Object.entries(subindicator.obj.children).map(c => {
            universe += c[1];
        })

        const val = count / universe;
        return {code: code, val: val};
    })

    return result
}
