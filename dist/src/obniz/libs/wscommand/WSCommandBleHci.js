"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class WSCommandBleHci {
    constructor(delegate) {
        this._delegate = delegate;
        this._CommandHCIInit = 41;
        this._CommandHCIDeinit = 42;
        this._CommandHCISend = 43;
        this._CommandHCIRecv = 44;
    }
    schemaData() {
        return [{ uri: "/request/ble/hci/write", onValid: this.send.bind(this) }];
    }
    notifyFunctionList() {
        const funcList = {};
        funcList[this._CommandHCIRecv] = this.recv.bind(this);
        return funcList;
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
}
exports.default = WSCommandBleHci;
//# sourceMappingURL=WSCommandBleHci.js.map