"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BleRemoteValueAttributeAbstract = void 0;
/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.Hci
 */
const bleRemoteAttributeAbstract_1 = require("./bleRemoteAttributeAbstract");
/**
 * @category Use as Central
 */
class BleRemoteValueAttributeAbstract extends bleRemoteAttributeAbstract_1.BleRemoteAttributeAbstract {
    /**
     * Wrapper for [[readWait]] with data converting to text.
     * It convert  UTF-8 and write binary array to string.
     *
     * It throws an error when failed.
     */
    readTextWait() {
        return super.readTextWait();
    }
    /**
     * Wrapper for [[writeWait]] with data converting from number.
     * It writes data as 1byte.
     *
     * It throws an error when failed.
     *
     * @return val
     */
    readNumberWait() {
        return super.readNumberWait();
    }
    /**
     * Wrapper for [[writeWait]] with data converting from text.
     * It convert string to UTF-8 and write binary array.
     *
     * It throws an error when failed.
     *
     * @param str
     * @param needResponse
     */
    writeTextWait(str, needResponse) {
        return super.writeTextWait(str, needResponse);
    }
    /**
     * Wrapper for [[writeWait]] with data converting from number.
     * It writes data as 1byte.
     *
     * It throws an error when failed.
     *
     * @param val
     * @param needResponse
     */
    writeNumberWait(val, needResponse) {
        return super.writeNumberWait(val, needResponse);
    }
}
exports.BleRemoteValueAttributeAbstract = BleRemoteValueAttributeAbstract;
