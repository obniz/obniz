class WSCommand_BleHci {
  constructor(delegate) {
    this._delegate = delegate;
    this._CommandHCIInit = 41;
    this._CommandHCIDeinit = 42;
    this._CommandHCISend = 43;
    this._CommandHCIRecv = 44;
  }

  schemaData() {
    return [{ uri: '/request/ble/hci/write', onValid: this.send.bind(this) }];
  }

  notifyFunctionList() {
    let funcList = {};
    funcList[this._CommandHCIRecv] = this.recv.bind(this);
    return funcList;
  }

  send(params, module) {
    let buf = new Uint8Array(params.hci.write.length);
    buf.set(params.hci.write);
    this._delegate.sendCommand(this._CommandHCISend, buf);
  }

  recv(objToSend, payload) {
    let arr = new Array(payload.byteLength);
    for (let i = 0; i < arr.length; i++) {
      arr[i] = payload[i];
    }

    objToSend.ble = objToSend.ble || {};
    objToSend.ble.hci = objToSend.ble.hci || {};
    objToSend.ble.hci.read = { data: arr };
  }
}

module.exports = WSCommand_BleHci;
