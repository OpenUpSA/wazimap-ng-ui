export function SiblingCalculator(args) {

    const result = Object.entries(args.data).map(childGeography => {
        const code = childGeography[0];
        const count = childGeography[1];
        let universe = 0;
        Object.entries(args.data).map(c => {
            universe += c[1];
        })

        const val = count / universe;
        return {code: code, val: val};
    })

    return result
}
