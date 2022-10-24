"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WSCommandBleHci = void 0;
/**
 * @packageDocumentation
 * @ignore
 */
class WSCommandBleHci {
    constructor(delegate) {
        this._CommandHCIInit = 41;
        this._CommandHCIDeinit = 42;
        this._CommandHCISend = 43;
        this._CommandHCIRecv = 44;
        this._CommandHCIAdvertisementFilter = 45;
        this._delegate = delegate;
    }
    schemaData() {
        return [
            { uri: '/request/ble/hci/init', onValid: this.init.bind(this) },
            { uri: '/request/ble/hci/deinit', onValid: this.deinit.bind(this) },
            { uri: '/request/ble/hci/write', onValid: this.send.bind(this) },
            {
                uri: '/request/ble/hci/advertisement_filter',
                onValid: this.advertisementFilter.bind(this),
            },
        ];
    }
    notifyFunctionList() {
        const funcList = {};
        funcList[this._CommandHCIRecv] = this.recv.bind(this);
        return funcList;
    }
    init(params, module) {
        const buf = new Uint8Array(0);
        this._delegate.sendCommand(this._CommandHCIInit, buf);
    }
    deinit(params, module) {
        const buf = new Uint8Array(0);
        this._delegate.sendCommand(this._CommandHCIDeinit, buf);
    }
    send(params, module) {
        const buf = new Uint8Array(params.hci.write.length);
        buf.set(params.hci.write);
        this._delegate.sendCommand(this._CommandHCISend, buf);
    }
    recv(objToSend, payload) {
        const arr = new Array(payload.byteLength);
        for (let i = 0; i < arr.length; i++) {
            arr[i] = payload[i];
        }
        objToSend.ble = objToSend.ble || {};
        objToSend.ble.hci = objToSend.ble.hci || {};
        objToSend.ble.hci.read = { data: arr };
    }
    advertisementFilter(params) {
        const sendData = [];
        params.hci.advertisement_filter.forEach((e) => {
            const one = [
                e.range.index,
                e.range.length,
                e.value.length,
                ...e.value,
            ];
            sendData.push(...one);
        });
        const buf = new Uint8Array(sendData.length);
        buf.set(sendData);
        this._delegate.sendCommand(this._CommandHCIAdvertisementFilter, buf);
    }
}
exports.WSCommandBleHci = WSCommandBleHci;
