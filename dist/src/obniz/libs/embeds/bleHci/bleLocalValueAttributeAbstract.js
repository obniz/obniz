"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BleLocalValueAttributeAbstract = void 0;
/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.Hci
 */
const bleLocalAttributeAbstract_1 = require("./bleLocalAttributeAbstract");
/**
 * @category Use as Peripheral
 */
class BleLocalValueAttributeAbstract extends bleLocalAttributeAbstract_1.BleLocalAttributeAbstract {
    constructor(params) {
        super(params);
    }
    /**
     * This writes dataArray.
     * It throws an error when failed.
     *
     * ```javascript
     * // Javascript Example
     * await attr.writeWait([0xf0,0x27]);
     * console.log("write success");
     * ```
     *
     * @param data
     */
    async writeWait(data) {
        this.data = data;
        this.notifyFromServer('onwrite', { result: 'success' });
        return true;
    }
    /**
     * It reads data.
     *
     * Even you wrote string or number, it returns binary array.
     * It throws an error when failed.
     *
     * ```javascript
     * // Javascript Example
     * let data =  await attr.readWait()
     *  console.log("data: " , data );
     * ```
     */
    async readWait() {
        this.notifyFromServer('onread', { data: this.data });
        return this.data;
    }
    /**
     * @ignore
     * @param notifyName
     * @param params
     */
    notifyFromServer(notifyName, params) {
        super.notifyFromServer(notifyName, params);
        this.emitter.emit(notifyName, params);
        switch (notifyName) {
            case 'onwritefromremote': {
                this._runUserCreatedFunction(this.onwritefromremote, params.address, Array.from(params.data));
                break;
            }
            case 'onreadfromremote': {
                this._runUserCreatedFunction(this.onreadfromremote, params.address);
                break;
            }
        }
    }
}
exports.BleLocalValueAttributeAbstract = BleLocalValueAttributeAbstract;
