"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PeripheralAD {
    constructor(obniz, id) {
        this.Obniz = obniz;
        this.id = id;
        this._reset();
    }
    /**
     * @ignore
     */
    _reset() {
        this.value = 0.0;
        this.observers = [];
    }
    addObserver(callback) {
        if (callback) {
            this.observers.push(callback);
        }
    }
    /**
     * This starts measuring voltage on ioX until end() is called.
     * ```Javascript
     * obniz.ad0.start(function(voltage){
     *  console.log("changed to "+voltage+" v")
     * });
     * ```
     * @param callback  called when voltage gets changed.
     */
    start(callback) {
        this.onchange = callback;
        const obj = {};
        obj["ad" + this.id] = {
            stream: true,
        };
        this.Obniz.send(obj);
        return this.value;
    }
    /**
     * This measures the voltage just once and returns its value.
     * This function will pause until ad result arrives to your js.
     *
     * ```javascript
     * obniz.io0.output(true)
     * var voltage = await obniz.ad0.getWait();
     * obniz.io0.output(false)
     * console.log(""+voltage+" should be closed to 5.00");
     * ```
     *
     * @return measured voltage
     *
     */
    getWait() {
        const self = this;
        return new Promise((resolve, reject) => {
            self.addObserver(resolve);
            const obj = {};
            obj["ad" + self.id] = {
                stream: false,
            };
            self.Obniz.send(obj);
        });
    }
    /**
     * This stops measuring voltage on ioX.
     * ```javascript
     * obniz.ad0.start();
     * obniz.ad0.end();
     * ```
     */
    end() {
        this.onchange = undefined;
        const obj = {};
        obj["ad" + this.id] = null;
        this.Obniz.send(obj);
        return;
    }
    /**
     * @ignore
     * @param obj
     */
    notified(obj) {
        this.value = obj;
        if (this.onchange) {
            this.onchange(obj);
        }
        const callback = this.observers.shift();
        if (callback) {
            callback(obj);
        }
    }
}
exports.default = PeripheralAD;

//# sourceMappingURL=ad.js.map
