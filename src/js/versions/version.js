import {Observable} from "../utils";

export class VersionModel extends Observable {
    constructor(name, isDefault) {
        super();

        this._name = name;
        this._isDefault = isDefault;
        this._isActive = isDefault;
    }

    get name() {
        return this._name;
    }

    get isDefault() {
        return this._isDefault;
    }

    get isActive() {
        return this._isActive;
    }

    set isActive(value) {
        this._isActive = value;
    }
}

export class Version extends Observable {
    constructor(name, isDefault) {
        //inheriting Component causes json circular reference
        super();

        this._model = new VersionModel(name, isDefault);
    }

    get model() {
        return this._model;
    }
}