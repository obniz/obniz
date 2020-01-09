class WSCommandBleHci {
  public _delegate: any;
  public _CommandHCIInit: any;
  public _CommandHCIDeinit: any;
  public _CommandHCISend: any;
  public _CommandHCIRecv: any;

  constructor(delegate: any) {
    this._delegate = delegate;
    this._CommandHCIInit = 41;
    this._CommandHCIDeinit = 42;
    this._CommandHCISend = 43;
    this._CommandHCIRecv = 44;
  }

  public schemaData() {
    return [{uri: "/request/ble/hci/write", onValid: this.send.bind(this)}];
  }

  public notifyFunctionList() {
    const funcList: any = {};
    funcList[this._CommandHCIRecv] = this.recv.bind(this);
    return funcList;
  }

  public send(params: any, module?: any) {
    const buf: any = new Uint8Array(params.hci.write.length);
    buf.set(params.hci.write);
    this._delegate.sendCommand(this._CommandHCISend, buf);
  }

  public recv(objToSend: any, payload?: any) {
    const arr: any = new Array(payload.byteLength);
    for (let i = 0; i < arr.length; i++) {
      arr[i] = payload[i];
    }

    objToSend.ble = objToSend.ble || {};
    objToSend.ble.hci = objToSend.ble.hci || {};
    objToSend.ble.hci.read = {data: arr};
  }
}

export default WSCommandBleHci;
