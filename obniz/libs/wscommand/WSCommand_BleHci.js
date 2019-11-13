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

  send(params, module) {
    let buf = new Uint8Array(1 + params.hci.write.length);
    buf[0] = module;
    buf.set(params.hci.write, 1);
    this._delegate.sendCommand(this._CommandHCISend, buf);
  }
}

module.exports = WSCommand_BleHci;
