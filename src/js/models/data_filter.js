export class DataFilter {
    constructor(group, keys = {
        name: 'name',
        values: 'subindicators'
    }) {
        this._name = group[keys.name];
        let values = group[keys.values];
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