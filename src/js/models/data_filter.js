export class DataFilter {
    constructor(group, keys = {
        name: 'name',
        values: 'subindicators'
    }) {
        this._values = group[keys.values];
        this._can_aggregate = group.can_aggregate;
        this._name = group[keys.name];
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