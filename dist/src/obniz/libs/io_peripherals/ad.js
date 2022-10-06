"use strict";
/**
 * @packageDocumentation
 * @module ObnizCore.Components
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PeripheralAD = void 0;
const ComponentAbstact_1 = require("../ComponentAbstact");
/**
 * @category Peripherals
 */
class PeripheralAD extends ComponentAbstact_1.ComponentAbstract {
    constructor(obniz, id) {
        super(obniz);
        this.id = id;
        this.on('/response/ad/get', (obj) => {
            this.value = obj;
            this.Obniz._runUserCreatedFunction(this.onchange, obj);
        });
        this._reset();
    }
    /**
     * This starts measuring voltage on ioX until end() is called.
     * ```Javascript
     * obniz.ad0.start(function(voltage){
     *  console.log("changed to "+voltage+" v")
     * });
     * ```
     *
     * @param callback  called when voltage gets changed.
     * @param callback.voltage  voltage
     */
    start(callback) {
        this.onchange = callback;
        const obj = {};
        obj['ad' + this.id] = {
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
    async getWait() {
        const obj = {};
        obj['ad' + this.id] = {
            stream: false,
        };
        const data = await this.sendAndReceiveJsonWait(obj, '/response/ad/get');
        return data;
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
        obj['ad' + this.id] = null;
        this.Obniz.send(obj);
        return;
    }
    /**
     * @ignore
     * @private
     */
    schemaBasePath() {
        return 'ad' + this.id;
    }
    /**
     * @ignore
     * @private
     */
    _reset() {
        this.value = 0.0;
    }
}
exports.PeripheralAD = PeripheralAD;
