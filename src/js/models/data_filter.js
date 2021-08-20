export class DataFilter {
    constructor(group) {
        this._values = group.subindicators;
        this._can_aggregate = group.can_aggregate;
        this._name = group.name;
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