export class MapLocker {
    constructor(delay=3000) {
        this._timeout = null;
        this._locked = false
        this._delay = delay;
    }

    get locked() {
        return this._locked;
    }

    clearTimeout() {
        if (this._timeout != null) {
            clearTimeout(this._timeout);
            this._timeout = null;
        }
    }

    lock() {
        const self = this;
        this.clearTimeout();
        this._timeout = setTimeout(() => self.unlock(), this._delay)
        this._locked = true;
    }

    unlock() {
        this._locked = false
        this.clearTimeout()
    }
}