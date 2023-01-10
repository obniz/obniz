"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BleLocalAttributeAbstract = void 0;
const bleAttributeAbstract_1 = require("./bleAttributeAbstract");
const bleHelper_1 = __importDefault(require("./bleHelper"));
/**
 * @ignore
 */
var BleResponseResult;
(function (BleResponseResult) {
    BleResponseResult[BleResponseResult["SUCCESS"] = 0] = "SUCCESS";
    BleResponseResult[BleResponseResult["INVALID_OFFSET"] = 7] = "INVALID_OFFSET";
    BleResponseResult[BleResponseResult["ATTR_NOT_LONG"] = 11] = "ATTR_NOT_LONG";
    BleResponseResult[BleResponseResult["INVALID_ATTRIBUTE_LENGTH"] = 13] = "INVALID_ATTRIBUTE_LENGTH";
    BleResponseResult[BleResponseResult["UNLIKELY_ERROR"] = 14] = "UNLIKELY_ERROR";
})(BleResponseResult || (BleResponseResult = {}));
/**
 * @category Use as Peripheral
 */
class BleLocalAttributeAbstract extends bleAttributeAbstract_1.BleAttributeAbstract {
    constructor(params) {
        super(params);
    }
    /**
     * @ignore
     */
    toBufferObj() {
        const obj = {
            uuid: bleHelper_1.default.uuidFilter(this.uuid),
            emit: this.emit.bind(this),
        };
        if (this.childrenName) {
            const key = this.childrenName;
            obj[key] = this.children.map((e) => e.toBufferObj());
        }
        return obj;
    }
    /**
     * @ignore
     * @param name
     * @param params
     */
    emit(name, ...params) {
        switch (name) {
            case 'readRequest':
                this._onReadRequest(...params);
                return true;
            case 'writeRequest':
                this._onWriteRequest(...params);
                return true;
        }
        return false;
    }
    /**
     * @ignore
     * @param offset
     * @param callback
     * @private
     */
    _onReadRequest(offset, callback) {
        if (this.data.length >= offset) {
            callback(BleResponseResult.SUCCESS, Buffer.from(this.data.slice(offset)));
            let address = null;
            if (this.parentName === 'characteristic') {
                address = this.characteristic.service.peripheral
                    .currentConnectedDeviceAddress;
            }
            else if (this.parentName === 'service') {
                address = this.service.peripheral.currentConnectedDeviceAddress;
            }
            this.notifyFromServer('onreadfromremote', { address });
        }
        else {
            callback(BleResponseResult.UNLIKELY_ERROR, null);
        }
    }
    /**
     * @ignore
     * @param data
     * @param offset
     * @param withoutResponse
     * @param callback
     * @private
     */
    _onWriteRequest(data, offset, withoutResponse, callback) {
        // console.log('onWriteRequest');
        this.data = Array.from(data);
        callback(BleResponseResult.SUCCESS);
        let address = null;
        if (this.parentName === 'characteristic') {
            address = this.characteristic.service.peripheral
                .currentConnectedDeviceAddress;
        }
        else if (this.parentName === 'service') {
            address = this.service.peripheral.currentConnectedDeviceAddress;
        }
        this.notifyFromServer('onwritefromremote', { address, data });
    }
    /**
     * @ignore
     * @param dataArray
     */
    async writeWait(dataArray) {
        this.data = dataArray;
        this.notifyFromServer('onwrite', { result: 'success' });
        return true;
    }
    /**
     * @ignore
     * @return dataArray
     */
    async readWait() {
        this.notifyFromServer('onread', { data: this.data });
        return this.data;
    }
}
exports.BleLocalAttributeAbstract = BleLocalAttributeAbstract;
