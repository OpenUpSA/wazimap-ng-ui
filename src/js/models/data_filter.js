export class DataFilter {
    constructor(group, restrictValues, keys = {
        name: 'name',
        values: 'subindicators'
    }) {
        this._name = group[keys.name];
        let values = group[keys.values];
        if (restrictValues[group[keys.name]] !== undefined) {
            values = values.filter(element => restrictValues[group[keys.name]].includes(element));
        }
        this._values = values;
        this._can_aggregate = group.can_aggregate;
    }

    get values() {
        return this._values;
    }

    get can_aggregate() {
        return this._can_aggregate;
    }

    get name() {
        return this._name;
    }
}